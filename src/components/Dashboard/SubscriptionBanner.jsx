// src/components/Dashboard/SubscriptionBanner.jsx

export function SubscriptionBanner({ subscription }) {
  if (!subscription) return null

  const isPremium = subscription.type === 'PREMIUM'
  const formatDate = (value) => {
    try {
      return new Date(value).toLocaleDateString('es-ES')
    } catch {
      return 'N/D'
    }
  }

  return (
    <div
      className={`rounded-2xl p-6 border ${
        isPremium
          ? 'bg-primary/10 border-primary/20'
          : 'bg-surface-container-low border-outline-variant/50'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4
            className={`font-semibold ${
              isPremium ? 'text-primary' : 'text-on-surface'
            }`}
          >
            Plan {subscription.type}
          </h4>
          <p
            className={`text-sm mt-1 ${
              isPremium ? 'text-on-surface-variant' : 'text-on-surface-variant'
            }`}
          >
            {subscription.status || 'ACTIVE'} · {isPremium ? 'Acceso completo' : 'Plan básico'}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isPremium
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-highest text-on-surface'
          }`}
        >
          {subscription.type}
        </span>
      </div>

      <div className="grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em]">Inicio</p>
          <p className="mt-1 text-on-surface">{formatDate(subscription.startDate)}</p>
        </div>
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em]">Vence</p>
          <p className="mt-1 text-on-surface">{formatDate(subscription.endDate)}</p>
        </div>
      </div>

      {!isPremium && (
        <button className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-medium text-on-primary transition-colors hover:bg-primary-fixed">
          Actualizar a Premium
        </button>
      )}
    </div>
  )
}
