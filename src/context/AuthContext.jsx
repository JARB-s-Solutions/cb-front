import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Regla 2: ¿Cómo saber si está logueado al refrescar?
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data); // Si responde 200, guardamos los datos del barbero
    } catch (error) {
      setUser(null); // Si responde 401, lo dejamos en null
    } finally {
      setIsLoading(false); // Terminamos de cargar
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Regla 3: El botón de Cerrar Sesión
  const logout = async () => {
    try {
      await api.post('/auth/logout'); // Le decimos al backend que destruya la cookie
      setUser(null); // Limpiamos el estado en React
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);