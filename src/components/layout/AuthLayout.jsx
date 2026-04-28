export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col antialiased">
      {/* Header sin iconos */}
      <header className="bg-slate-950/80 backdrop-blur-md tracking-tight border-b border-slate-800 shadow-2xl shadow-black/50 fixed top-0 w-full z-50 flex items-center px-6 h-16">
        <div className="flex items-center">
          <span className="text-xl font-bold tracking-tighter text-slate-50 uppercase">
            Control Barber
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center pt-16 pb-8 px-gutter">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-[10px] uppercase tracking-widest font-medium py-8 border-t border-slate-900 w-full flex flex-col md:flex-row justify-between items-center px-12 gap-4 mt-auto">
        <div className="text-slate-500">
          © 2026 Control Barber - Todos los derechos reservados.
        </div>
        <div className="flex gap-6">
          <a className="text-slate-500 hover:text-slate-300 transition-colors" href="#">Politica de privacidad</a>
          <a className="text-slate-500 hover:text-slate-300 transition-colors" href="#">Terminos de servicio</a>
          <a className="text-slate-500 hover:text-slate-300 transition-colors" href="#">Soporte</a>
        </div>
      </footer>
    </div>
  );
}