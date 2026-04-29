import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../config/axios'; 
import { useAuth } from '../../context/AuthContext'; 

export default function RegisterForm() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth(); // Función para actualizar la sesión global
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 1. REGISTRO TRADICIONAL
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Axios envía la petición a la URL base configurada
      await api.post('/auth/register', formData);

      setSuccessMessage("Usuario registrado exitosamente. Redirigiendo al login...");
      setFormData({ fullName: '', username: '', email: '', phone: '', password: '' });

      // Tras registrarse normalmente, lo mandamos al login para que inicie sesión
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      // Axios guarda los errores del backend en err.response.data
      if (err.response?.data?.details?.length > 0) {
        setError(err.response.data.details[0].message); // Error de validación (Zod)
      } else {
        setError(err.response?.data?.error || "Error al registrar usuario");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. REGISTRO / LOGIN CON GOOGLE
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await api.post('/auth/google', {
        googleToken: credentialResponse.credential
      });

      if (response.data.status === "success") {
        setSuccessMessage("¡Cuenta vinculada exitosamente!");
        
        await checkAuth(); // Le decimos a React que revise la cookie e inicie sesión
        
        setTimeout(() => {
          navigate('/dashboard'); // Y lo mandamos adentro de la app
        }, 1000);
      }

    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detalle || "Error al conectar con Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-surface-container rounded-xl border border-outline-variant shadow-2xl flex flex-col relative overflow-hidden">
      <div className="px-6 md:px-10 py-8 flex flex-col gap-5">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant">
            <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>content_cut</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Control Barber</h1>
            <p className="text-sm text-on-surface-variant opacity-80 mt-0.5">Crea tu cuenta de artesano</p>
          </div>
        </div>

        {/* Alertas */}
        {error && (
          <div className="p-3 rounded-lg bg-error-container/20 border-l-4 border-error text-on-error-container flex items-start gap-2">
            <span className="material-symbols-outlined text-error text-[20px] mt-0.5">error</span>
            <div>
              <p className="font-bold text-[13px]">Error en el registro</p>
              <p className="text-[13px] mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-lg bg-green-900/40 border-l-4 border-green-500 text-green-200 flex items-start gap-2">
            <span className="material-symbols-outlined text-green-500 text-[20px] mt-0.5">check_circle</span>
            <div>
              <p className="font-bold text-[13px]">¡Éxito!</p>
              <p className="text-[13px] mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-on-surface-variant px-1" htmlFor="fullName">Nombre Completo</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[20px] text-outline group-focus-within:text-primary transition-colors">person</span>
              </div>
              <input className="w-full bg-surface-container-highest border border-outline-variant text-on-surface text-sm rounded-lg pl-10 pr-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-outline/50 transition-all" 
                id="fullName" name="fullName" placeholder="Ej. Juan Pérez" required type="text"
                value={formData.fullName} onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-on-surface-variant px-1" htmlFor="username">Usuario</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[20px] text-outline group-focus-within:text-primary transition-colors">account_circle</span>
              </div>
              <input className="w-full bg-surface-container-highest border border-outline-variant text-on-surface text-sm rounded-lg pl-10 pr-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-outline/50 transition-all" 
                id="username" name="username" placeholder="juanperez88" required type="text"
                value={formData.username} onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-on-surface-variant px-1" htmlFor="email">Correo electrónico</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[20px] text-outline group-focus-within:text-primary transition-colors">mail</span>
              </div>
              <input className="w-full bg-surface-container-highest border border-outline-variant text-on-surface text-sm rounded-lg pl-10 pr-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-outline/50 transition-all" 
                id="email" name="email" placeholder="juan@ejemplo.com" required type="email"
                value={formData.email} onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-on-surface-variant px-1" htmlFor="phone">Teléfono</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[20px] text-outline group-focus-within:text-primary transition-colors">phone</span>
              </div>
              <input className="w-full bg-surface-container-highest border border-outline-variant text-on-surface text-sm rounded-lg pl-10 pr-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-outline/50 transition-all" 
                id="phone" name="phone" placeholder="999 000 0000" required type="tel"
                value={formData.phone} onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-on-surface-variant px-1" htmlFor="password">Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[20px] text-outline group-focus-within:text-primary transition-colors">lock</span>
              </div>
              <input className="w-full bg-surface-container-highest border border-outline-variant text-on-surface text-sm rounded-lg pl-10 pr-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-outline/50 transition-all" 
                id="password" name="password" placeholder="••••••••" required type="password"
                value={formData.password} onChange={handleChange}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-primary-container text-on-primary-container font-semibold rounded-lg py-2.5 mt-2 flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow-lg shadow-primary-container/20 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Creando...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center gap-4 w-full my-1">
          <div className="h-px bg-outline-variant flex-1 opacity-50"></div>
          <span className="text-[11px] text-on-surface-variant font-semibold tracking-wider">O</span>
          <div className="h-px bg-outline-variant flex-1 opacity-50"></div>
        </div>

        {/* Botón de Google */}
        <div className="flex justify-center w-full">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess}
            onError={() => setError("La conexión con Google falló.")}
            useOneTap={false}
            theme="filled_black"
            shape="rectangular"
            text="continue_with"
            width="340"
          />
        </div>

        {/* Footer Link */}
        <div className="text-center mt-1">
          <span className="text-on-surface-variant opacity-80 text-[13px]">¿Ya tienes una cuenta? </span>
          <Link to="/" className="font-semibold text-[13px] text-primary hover:text-primary-fixed transition-colors underline-offset-4 hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}