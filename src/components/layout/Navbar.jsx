import { useMemo, useState } from 'react'
import { useAuth } from '../../context/useAuth'

export function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const { user, logout } = useAuth()

  const userInitial = useMemo(() => {
    const source = user?.fullName || user?.name || 'C'
    return source.trim().charAt(0).toUpperCase()
  }, [user])

  const planLabel = user?.subscription?.type || 'FREE'

  return (
    <nav className="sticky top-0 z-40 border-b border-outline-variant/40 bg-surface-container-low/90 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(174,198,255,0.08)]">
            <span className="text-xl">💈</span>
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
              Control Barber
            </span>
            <span className="block text-xs text-on-surface-variant/80">
              Panel del barbero
            </span>
          </div>
        </div>

        {/* Search & Icons */}
        <div className="mx-8 hidden max-w-xl flex-1 md:flex">
          <input
            type="text"
            placeholder="Buscar cliente o cita..."
            className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-highest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container px-3 py-1.5 text-xs text-on-surface-variant lg:flex">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Plan {planLabel}</span>
          </div>

          {/* Notificaciones */}
          <button className="relative rounded-xl border border-outline-variant/50 bg-surface-container-highest p-2.5 text-on-surface-variant transition-colors hover:text-primary">
            <span className="text-xl">🔔</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary"></span>
          </button>

          {/* Menu User */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 rounded-xl border border-outline-variant/50 bg-surface-container-highest px-2.5 py-2 transition-colors hover:border-primary/60"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary text-sm font-bold">
                {userInitial}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium text-on-surface">{user?.fullName || 'Mi cuenta'}</p>
                <p className="text-[11px] text-on-surface-variant">{user?.email || 'Sesión activa'}</p>
              </div>
            </button>

            {/* Dropdown */}
            {showMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-low shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <button className="w-full px-4 py-3 text-left text-sm text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface">
                  👤 Mi Perfil
                </button>
                <button className="w-full px-4 py-3 text-left text-sm text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface">
                  ⚙️ Configuración
                </button>
                <button
                  onClick={() => {
                    logout()
                    setShowMenu(false)
                  }}
                  className="w-full border-t border-outline-variant/40 px-4 py-3 text-left text-sm text-error transition-colors hover:bg-error/10"
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
