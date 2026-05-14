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
      // Intentar obtener barberId desde distintas claves de localStorage
      let barberId = localStorage.getItem('barberId');

      if (!barberId) {
        const authUserStr = localStorage.getItem('authUser') || localStorage.getItem('user') || localStorage.getItem('auth');
        if (authUserStr) {
          try {
            const parsed = JSON.parse(authUserStr);
            barberId = parsed?.id || parsed?.user?.id || null;
            if (barberId) localStorage.setItem('barberId', barberId);
          } catch {
            // no JSON — ignoramos
          }
        }
      }

      // Si aún no existe barberId, intentar recuperar perfil desde backend usando la sesión (cookie/token)
      if (!barberId) {
        try {
          const profile = await api.get('/auth/profile');
          const id = profile.data?.id || profile.data?.user?.id;
          if (id) {
            barberId = id;
            localStorage.setItem('barberId', barberId);
          }
        } catch (profileErr) {
          console.warn('No se pudo recuperar perfil para deducir barberId:', profileErr?.response?.data || profileErr.message);
        }
      }

      if (!barberId) {
        console.error("No se encontró el ID del barbero en la sesión. Asegúrate de iniciar sesión.");
        setIsLoading(false);
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
      // Antes de subir, verificar sesión/usuario (el backend usa req.user desde la cookie/token)
      let barberId = localStorage.getItem('barberId');
      if (!barberId) {
        try {
          const profile = await api.get('/auth/profile');
          const id = profile.data?.id || profile.data?.user?.id;
          if (id) localStorage.setItem('barberId', id);
        } catch (err) {
          console.error('No autenticado: no se puede subir la imagen', err?.response?.data || err.message);
          alert('Debes iniciar sesión para subir una imagen.');
          return false;
        }
      }

      // No forzar 'Content-Type' — axios añade el boundary automáticamente
      const res = await api.post('/gallery', formData);
      console.log('Upload response:', res.data);
      await fetchGallery(); // Refrescamos la galería
      return true;
    } catch (err) {
      console.error('Error uploading image:', err?.response?.data || err.message);
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Error al subir la imagen. Límite 5MB.';
      alert(message);
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