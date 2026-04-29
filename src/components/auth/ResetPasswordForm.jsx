import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extraemos el token de la URL (ej: ?token=069eea2c...)
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validaciones locales
    if (!token) {
      setError("No se encontró un token válido en la URL.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://controlbarber-backend.vercel.app/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar la contraseña");
      }

      setSuccessMessage("¡Contraseña actualizada! Redirigiendo al inicio de sesión...");
      setPassword('');
      setConfirmPassword('');

      // Redirigir al login después de 2.5 segundos
      setTimeout(() => {
        navigate('/');
      }, 2500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-surface-container rounded-xl border border-outline-variant shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-10 px-8 relative overflow-hidden flex flex-col gap-6">
      
      {/* Loading Indicator (Top Edge) */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-surface-container-highest">
          <div className="h-full bg-primary w-1/3 animate-[shimmer_1s_infinite]"></div>
        </div>
      )}

      {/* Header / Branding */}
      <header className="flex flex-col items-center text-center mb-2">
        <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center mb-4 border border-outline-variant shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-1">Crear Nueva Contraseña</h1>
        <p className="text-sm text-on-surface-variant">
          Introduce tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
        </p>
      </header>

      {/* Alertas */}
      {error && (
        <div className="p-3 rounded-lg bg-error-container/20 border-l-4 border-error text-on-error-container flex items-start gap-2">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5">error</span>
          <p className="text-[13px] mt-0.5">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-lg bg-green-900/40 border-l-4 border-green-500 text-green-200 flex items-start gap-2">
          <span className="material-symbols-outlined text-green-500 text-[20px] mt-0.5">check_circle</span>
          <p className="text-[13px] mt-0.5">{successMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Nueva Contraseña */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-on-surface uppercase tracking-widest pl-1" htmlFor="new_password">
            Nueva Contraseña
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[20px] text-outline">lock</span>
            <input 
              id="new_password" type="password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-2.5 pl-10 pr-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] placeholder:text-outline-variant"
            />
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-on-surface uppercase tracking-widest pl-1" htmlFor="confirm_password">
            Confirmar Contraseña
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[20px] text-outline">lock</span>
            <input 
              id="confirm_password" type="password" required
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-2.5 pl-10 pr-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] placeholder:text-outline-variant"
            />
          </div>
        </div>

        {/* Validation Hint */}
        <div className="flex items-start gap-1.5 text-outline px-1">
          <span className="material-symbols-outlined text-[16px] mt-[2px]">info</span>
          <p className="text-[12px] leading-tight pt-0.5">
            La contraseña debe tener al menos 6 caracteres.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-col gap-3">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-primary text-on-primary font-semibold text-[15px] py-3 rounded-lg flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(174,198,255,0.1)] transition-all duration-200 ${
              isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(174,198,255,0.2)] active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span>Actualizar Contraseña</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
          
          <Link to="/" className="w-full border border-outline-variant text-on-surface-variant font-semibold text-sm py-3 rounded-lg hover:bg-surface-container-highest hover:text-on-surface transition-colors duration-200 flex justify-center items-center text-center">
            Cancelar y volver
          </Link>
        </div>
      </form>
    </div>
  );
}