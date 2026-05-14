import { useState, useCallback } from 'react';
import { api } from '../config/axios';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      // Optimizamos la UI cambiando el estado al instante sin esperar al backend
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      
      await api.patch('/notifications/read-all');
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};