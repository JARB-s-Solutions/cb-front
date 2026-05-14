import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { id: 'appointments', label: 'Citas', href: '/citas', icon: '📅' },
  { id: 'services', label: 'Servicios', href: '/servicios', icon: '✂️' },
  { id: 'schedule', label: 'Horarios', href: '/horarios', icon: '⏰' },
  { id: 'clients', label: 'Clientes', href: '/clientes', icon: '👨' },
  { id: 'finanzas', label: 'Caja', href: '/finanzas', icon: '🍱' },
]

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (href) => location.pathname === href
  const planLabel = useMemo(() => user?.subscription?.type || 'FREE', [user])

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[1px] md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 overflow-y-auto border-r border-outline-variant/40 bg-surface-container-low/95 backdrop-blur-md transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5">
          <div className="rounded-3xl border border-primary/15 bg-surface-container px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-on-surface-variant">Tu panel</p>
            <p className="mt-1 text-lg font-semibold text-on-surface">{user?.fullName || 'Barbero activo'}</p>
            <p className="mt-1 text-sm text-on-surface-variant">{user?.email || 'Sesión iniciada'}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Plan {planLabel}
            </div>
          </div>
        </div>

        <nav className="space-y-1 px-4 pb-4">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              onClick={() => onClose?.()}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
                isActive(item.href)
                  ? 'border-primary/25 bg-primary/10 font-semibold text-primary'
                  : 'border-transparent text-on-surface-variant hover:border-outline-variant/40 hover:bg-surface-container-highest/70 hover:text-on-surface'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

      </aside>
    </>
  )
}
