export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col antialiased bg-background text-on-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-6rem] h-96 w-96 rounded-full bg-primary-fixed/5 blur-3xl" />
      </div>
      {/* Header sin iconos */}
      <header className="bg-surface-container-low/90 backdrop-blur-md tracking-tight border-b border-outline-variant/40 shadow-[0_1px_0_rgba(255,255,255,0.03)] fixed top-0 w-full z-50 flex items-center px-6 h-16">
        <div className="flex items-center">
          <span className="text-xl font-bold tracking-tighter text-on-surface uppercase">
            Control Barber
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center pt-16 pb-8 px-gutter">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low text-[10px] uppercase tracking-widest font-medium py-8 border-t border-outline-variant/40 w-full flex flex-col md:flex-row justify-between items-center px-12 gap-4 mt-auto relative z-10">
        <div className="text-on-surface-variant">
          © 2026 Control Barber - Todos los derechos reservados.
        </div>
        <div className="flex gap-6">
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Politica de privacidad</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terminos de servicio</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Soporte</a>
        </div>
      </footer>
    </div>
  );
}