import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // 1. INICIO DE SESIÓN TRADICIONAL
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("https://controlbarber-backend.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      // Guardar token JWT
      localStorage.setItem('token', data.token);
      setSuccessMessage(data.message);
      
      console.log("Usuario logueado:", data.user);
      
      // Redirección
      setTimeout(() => {
        // window.location.href = '/dashboard'; 
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. INICIO DE SESIÓN CON GOOGLE
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("https://controlbarber-backend.vercel.app/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleToken: credentialResponse.credential // El string 'eyJ...'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al conectar con Google");
      }

      // Validar la estructura de respuesta de tu googleLogin
      if (data.status === "success") {
        localStorage.setItem('token', data.token);
        setSuccessMessage("¡Bienvenido con Google!");
        
        console.log("Usuario de Google logueado:", data.data.barber);
        
        // Redirección
        setTimeout(() => {
          // window.location.href = '/dashboard';
        }, 1000);
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
      <div className="px-10 py-12">
        
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>cut</span>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Bienvenido</h1>
          <p className="text-sm text-on-surface-variant">Inicia sesión en Control Barber</p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error-container/20 border-l-4 border-error text-on-error-container flex items-start gap-3">
            <span className="material-symbols-outlined text-error mt-0.5">error</span>
            <div>
              <p className="font-bold text-sm">Error de Autenticación</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-900/40 border-l-4 border-green-500 text-green-200 flex items-start gap-3">
            <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
            <div>
              <p className="font-bold text-sm">¡Éxito!</p>
              <p className="text-sm mt-1">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Formulario Tradicional */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant block" htmlFor="email">Correo electrónico</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <input 
                type="email" id="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                className="w-full bg-surface-container-highest text-on-surface border border-outline-variant rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-shadow placeholder:text-outline-variant"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-on-surface-variant block" htmlFor="password">Contraseña</label>
              <a href="#" className="text-sm font-semibold text-primary hover:text-primary-fixed transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <input 
                type="password" id="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-highest text-on-surface border border-outline-variant rounded-lg py-3 pl-10 pr-10 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-shadow placeholder:text-outline-variant"
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg transition-all duration-200 font-semibold ${
                isLoading 
                ? 'bg-primary/70 text-on-primary/70 cursor-not-allowed' 
                : 'bg-primary text-on-primary hover:bg-primary-fixed hover:shadow-[0_0_15px_rgba(174,198,255,0.3)] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  Procesando...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>

        {/* Divisor "O" */}
        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-outline-variant/30"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-outline-variant uppercase">O</span>
          <div className="flex-grow border-t border-outline-variant/30"></div>
        </div>

        {/* Botón Oficial de Google */}
        <div className="flex justify-center w-full">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess}
            onError={() => setError("La conexión con Google falló.")}
            useOneTap={false}
            theme="filled_black" // Opciones: 'outline', 'filled_blue', 'filled_black'
            shape="rectangular"
            text="continue_with"
            width="360"
          />
        </div>

      </div>
    </div>
  );
}