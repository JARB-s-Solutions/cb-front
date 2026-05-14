// src/components/Dashboard/MetricCard.jsx

export function MetricCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/25">
      {/* Header con icono */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-on-surface-variant">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>

      {/* Valor principal */}
      <div className="mb-2">
        <p className="text-3xl font-bold text-on-surface">{value}</p>
      </div>

      {/* Subtítulo y tendencia */}
      <div className="flex items-center justify-between">
        {subtitle && <p className="text-xs text-on-surface-variant">{subtitle}</p>}
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              trend.startsWith('-')
                ? 'text-error bg-error/10'
                : 'text-primary bg-primary/10'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
