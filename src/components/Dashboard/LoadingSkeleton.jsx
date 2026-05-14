// src/components/Dashboard/LoadingSkeleton.jsx

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container-low"></div>
        ))}
      </div>

      {/* Gráfico y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container-low"></div>
        <div className="h-64 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container-low"></div>
      </div>

      {/* Suscripción */}
      <div className="h-32 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container-low"></div>
    </div>
  )
}
