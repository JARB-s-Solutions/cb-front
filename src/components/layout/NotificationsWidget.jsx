import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../../hooks/useNotifications';

// Función auxiliar para fechas amigables sin dependencias extra
const timeAgo = (dateStr) => {
  const diff = new Date() - new Date(dateStr);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Hace un momento';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return `Hace ${Math.floor(hours / 24)} días`;
};

export function NotificationsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { 
    notifications, unreadCount, fetchNotifications, 
    markAsRead, markAllAsRead 
  } = useNotifications();

  // Cargar al inicio y refrescar cada minuto
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Cerrar al hacer clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BOTÓN DE LA CAMPANA */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-[24px]">notifications</span>
        
        {/* Badge Rojo de Notificaciones sin leer */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-[#10131a] px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* MENÚ DESPLEGABLE */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-[9999]">
          
          {/* Header del menú */}
          <div className="p-4 border-b border-gray-800 bg-[#141414] flex justify-between items-center">
            <h3 className="font-bold text-white text-lg">Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
              >
                Marcar todo como leído
              </button>
            )}
          </div>

          {/* Lista de Notificaciones */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">notifications_paused</span>
                <p>No tienes notificaciones por ahora</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-800/50">
                {notifications.map((notif) => (
                  <li 
                    key={notif.id}
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                    className={`p-4 transition-colors cursor-pointer hover:bg-gray-800/50 flex gap-3 ${
                      !notif.isRead ? 'bg-red-900/10' : 'opacity-70'
                    }`}
                  >
                    {/* Indicador de no leído */}
                    <div className="mt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${!notif.isRead ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-transparent'}`}></div>
                    </div>
                    
                    {/* Contenido */}
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold ${!notif.isRead ? 'text-white' : 'text-gray-300'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-0.5 leading-snug">
                        {notif.message}
                      </p>
                      <span className="text-[11px] text-gray-500 mt-2 block font-medium">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-800 bg-[#141414] text-center">
            <p className="text-xs text-gray-500">Solo se muestran los últimos 20 avisos</p>
          </div>
        </div>
      )}
    </div>
  );
}