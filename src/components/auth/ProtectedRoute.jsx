import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  // Mientras verifica la cookie con el backend, mostramos un loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
      </div>
    );
  }

  // Si terminó de cargar y no hay usuario, lo botamos al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, lo dejamos pasar
  return children;
}