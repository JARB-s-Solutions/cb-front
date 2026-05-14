import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth(); 
  const cachedUser = localStorage.getItem('authUser')

  // Si no hay usuario en contexto ni en localStorage, redirige al login
  if (!user && !cachedUser) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, lo dejamos pasar
  return children;
}