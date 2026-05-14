import { useState, useCallback } from 'react';
import { api } from '../config/axios';

export const useFinance = () => {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [closes, setCloses] = useState([]); // <-- NUEVO ESTADO PARA CIERRES
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/finance/summary?timeZone=${timeZone}`);
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError('Error al cargar el resumen financiero');
    } finally {
      setIsLoading(false);
    }
  }, [timeZone]);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await api.get(`/finance/history`);
      setHistory(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  }, []);

  // NUEVA FUNCIÓN: Obtener el historial de cierres
  const fetchCloses = useCallback(async () => {
    try {
      const response = await api.get('/finance/closes');
      setCloses(response.data);
    } catch (err) {
      console.error('Error fetching closes:', err);
    }
  }, []);

  const openDay = async (initialCash) => {
    try {
      await api.post('/finance/open-day', { initialCash: Number(initialCash), timeZone });
      await fetchSummary();
      await fetchCloses(); // Refrescamos cierres por si acaso
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Error al abrir la caja');
      return false;
    }
  };

  const createTransaction = async (data) => {
    try {
      await api.post('/finance', { ...data, amount: Number(data.amount), timeZone });
      await fetchSummary();
      await fetchHistory();
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar el movimiento');
      return false;
    }
  };

  const closeDay = async () => {
    try {
      await api.post('/finance/close', { timeZone });
      await fetchSummary();
      await fetchCloses(); // <-- ESTO ES CLAVE PARA QUE LA UI SE ACTUALICE AL CERRAR
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cerrar la caja');
      return false;
    }
  };

  // NUEVA FUNCIÓN: Reabrir caja (Conecta con tu ruta DELETE /close)
  const undoClose = async () => {
    try {
      await api.delete('/finance/close', { data: { timeZone } });
      await fetchSummary();
      await fetchCloses();
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reabrir la caja');
      return false;
    }
  };

  return {
    summary,
    history,
    closes,
    isLoading,
    error,
    fetchSummary,
    fetchHistory,
    fetchCloses,
    openDay,
    createTransaction,
    closeDay,
    undoClose
  };
};