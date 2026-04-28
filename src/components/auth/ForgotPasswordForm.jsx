import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("https://controlbarber-backend.vercel.app/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al solicitar la recuperación");
      }

      // El backend devuelve: { message: "Si el correo existe, recibirás un enlace..." }
      setSuccessMessage(data.message || "Se ha enviado un enlace de recuperación a tu correo.");
      setEmail(''); // Limpiar el input

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[440px]">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center opacity-30">
        <div className="w-[400px] h-[400px] bg-primary rounded-full blur-[100px] opacity-20 mix-blend-screen"></div>
      </div>

      {/* Contenedor Principal */}
      <div className="relative z-10 w-full bg-surface-container-low border border-outline-variant/50 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] pt-10 pb-10 px-8 sm:px-10 flex flex-col gap-6 overflow-hidden">
        
        {/* Barra de progreso superior (Visible solo al cargar) */}
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-[2px] bg-surface-variant overflow-hidden">
            <div className="h-full w-1/4 bg-primary rounded-r-full animate-[shimmer_1.5s_infinite]"></div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center mb-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
            <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Recuperar Contraseña</h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Ingresa tu correo electrónico asociado a la cuenta. Si existe, recibirás un enlace de recuperación.
          </p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="p-3 rounded-lg bg-error-container/20 border-l-4 border-error text-on-error-container flex items-start gap-2">
            <span className="material-symbols-outlined text-error text-[20px] mt-0.5">error</span>
            <p className="text-[13px] mt-0.5">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-lg bg-green-900/40 border-l-4 border-green-500 text-green-200 flex items-start gap-2">
            <span className="material-symbols-outlined text-green-500 text-[20px] mt-0.5">mark_email_read</span>
            <p className="text-[13px] mt-0.5">{successMessage}</p>
          </div>
        )}

        {/* Recovery Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          
          {/* Email Input Group */}
          <div className="flex flex-col gap-1.5 group">
            <label className="text-[13px] font-semibold text-on-surface-variant ml-1 transition-colors group-focus-within:text-primary" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[20px] text-outline group-focus-within:text-primary transition-colors duration-200">mail</span>
              </div>
              <input 
                id="email" name="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@controlbarber.com" 
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-2.5 pl-10 pr-3 text-sm text-on-surface placeholder:text-outline shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200" 
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-primary text-on-primary py-3 rounded-lg text-[15px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 relative overflow-hidden group ${
              isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-primary-fixed hover:shadow-[0_0_15px_rgba(174,198,255,0.3)] active:scale-[0.98]'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
              {isLoading && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
            </span>
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="flex justify-center mt-2">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Volver al inicio de sesión</span>
          </Link>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}} />
    </div>
  );
}