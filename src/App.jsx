import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Ruta de registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Ruta de recuperar contraseña */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Si escriben una URL que no existe, los mandamos al login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App