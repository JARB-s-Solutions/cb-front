import { useState, useCallback } from 'react';
import { api } from '../config/axios';

export const useGallery = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las imágenes de la galería
  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      // Obtenemos tu ID de barbero desde el localStorage
      const userStr = localStorage.getItem('user');
      const barberId = userStr ? JSON.parse(userStr).id : null;

      if (!barberId) {
        console.error("No se encontró el ID del barbero en la sesión");
        return;
      }

      // El backend exige el ID en la URL: GET /api/gallery/:barberId
      const response = await api.get(`/gallery/${barberId}`);
      setImages(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Error al cargar la galería');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subir una nueva imagen (Requiere FormData)
  const uploadImage = async (formData) => {
    try {
      // No forzar 'Content-Type' — axios añade el boundary automáticamente
      await api.post('/gallery', formData);
      await fetchGallery(); // Refrescamos la galería
      return true;
    } catch (err) {
      console.error('Error uploading image:', err);
      alert(err.response?.data?.error || 'Error al subir la imagen. Límite 5MB.');
      return false;
    }
  };

  // MVP: El backend actual no soporta edición
  const updateImage = async () => {
    alert("Aviso MVP: El backend no permite editar fotos. Elimínala y súbela de nuevo.");
    return false;
  };

  // Eliminar una imagen
  const deleteImage = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      setImages(prev => prev.filter(img => img.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting image:', err);
      alert(err.response?.data?.error || 'Error al eliminar la imagen');
      return false;
    }
  };

  return {
    images,
    isLoading,
    error,
    fetchGallery,
    uploadImage,
    updateImage,
    deleteImage
  };
};