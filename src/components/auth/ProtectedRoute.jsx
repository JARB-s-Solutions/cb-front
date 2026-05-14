import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth(); 
  const cachedUser = localStorage.getItem('authUser')

  // Mientras verifica la cookie con el backend, mostramos un loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
      </div>
    );
  }

  // Si terminó de cargar y no hay usuario, lo botamos al login
  if (!user && !cachedUser) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, lo dejamos pasar
  return children;
}