import { useState, useCallback } from 'react';
import { api } from '../config/axios';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/clients');
      setClients(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setError('No se pudieron cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // MVP: El backend no tiene ruta POST para clientes aislados
  const createClient = async (clientData) => {
    alert("Aviso MVP: El backend actual no tiene ruta para crear clientes manualmente. Los clientes se asocian al crear citas.");
    return false; 
  };

  const updateClient = async (id, clientData) => {
    try {
      // Adaptamos los datos exactamente a lo que pide el updateClientSchema (Zod) del backend
      const payload = {
        name: clientData.name,
        internalNotes: clientData.notes // El backend espera internalNotes
      };

      // Usamos PATCH en lugar de PUT, coincidiendo con router.patch()
      const response = await api.patch(`/clients/${id}`, payload);
      const updatedClient = response.data.data || response.data;
      
      setClients((prev) =>
        prev.map((client) => {
          if (client.id === id) {
            // Mantenemos los datos de lectura (email, phone) y actualizamos los editados
            return {
              ...client,
              name: updatedClient.name,
              notes: updatedClient.internalNotes
            };
          }
          return client;
        })
      );
      return true;
    } catch (err) {
      console.error('Error actualizando cliente:', err);
      alert('Error al actualizar el cliente verifique los datos.');
      return false;
    }
  };

  // MVP: El backend no tiene ruta DELETE
  const deleteClient = async (id) => {
    alert("Aviso MVP: El backend actual no permite eliminar clientes.");
    return false;
  };

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    createClient, // Se exporta para no romper la UI, pero muestra alerta
    updateClient,
    deleteClient
  };
};