import { useState, useCallback } from 'react';
import { api } from '../config/axios';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los clientes
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/clients');
      setClients(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('No se pudieron cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crear un nuevo cliente
  const createClient = async (clientData) => {
    try {
      const response = await api.post('/clients', clientData);
      setClients((prev) => [...prev, response.data.data || response.data]);
      return true;
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Error al crear el cliente');
      return false;
    }
  };

  // Actualizar un cliente
  const updateClient = async (id, clientData) => {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      setClients((prev) =>
        prev.map((client) => (client.id === id ? (response.data.data || response.data) : client))
      );
      return true;
    } catch (err) {
      console.error('Error updating client:', err);
      setError('Error al actualizar el cliente');
      return false;
    }
  };

  // Eliminar un cliente
  const deleteClient = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      setClients((prev) => prev.filter((client) => client.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Error al eliminar el cliente');
      return false;
    }
  };

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  };
};