import { useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import { useDashboard } from '../hooks/useDashboard'
import { useAppointments } from '../hooks/useAppointments'
import { MetricCard } from '../components/Dashboard/MetricCard'
import { AppointmentTable } from '../components/Dashboard/AppointmentTable'
import { SubscriptionBanner } from '../components/Dashboard/SubscriptionBanner'
import { DashboardSkeleton } from '../components/Dashboard/LoadingSkeleton'

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`

export function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading, error, refreshDashboard } = useDashboard()
  const { appointments, fetchAppointments, updateAppointmentStatus, isLoading: appointmentsLoading } = useAppointments()

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    void refreshDashboard()
    fetchAppointments({ date: today })
  }, [fetchAppointments, refreshDashboard, today])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8">
        <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-error">
          <p className="font-medium">Error al cargar dashboard</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8">
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-4 text-on-surface-variant">
          No hay datos disponibles.
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Ingresos hoy',
      value: formatMoney(data.today?.totalIncome),
      subtitle: `${data.today?.growthPercentage ?? 0}% vs ayer`,
      icon: '💰',
      trend: `${data.today?.growthPercentage >= 0 ? '+' : ''}${data.today?.growthPercentage ?? 0}%`,
    },
    {
      title: 'Citas hoy',
      value: data.appointments?.total ?? 0,
      subtitle: `${data.appointments?.completed ?? 0} completadas`,
      icon: '📅',
      trend: `${data.appointments?.pending ?? 0} pendientes`,
    },
    {
      title: 'Ocupación',
      value: `${data.occupancy?.percent ?? 0}%`,
      subtitle: `${data.occupancy?.freeHours ?? 0} h libres`,
      icon: '⏱️',
      trend: `${data.occupancy?.blocksUsed ?? 0} bloqueos`,
    },
    {
      title: 'Rating',
      value: `${Number(data.reputation?.score || 0).toFixed(1)}/5`,
      subtitle: 'Reseñas recientes',
      icon: '⭐',
      trend: `${data.reputation?.recent?.length ?? 0} nuevas`,
    },
  ]

  return (
    <div className="relative z-10 space-y-6 px-4 py-6 md:px-6 lg:px-8">
      <header className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant">Resumen del día</p>
            <h1 className="mt-2 text-3xl font-bold text-on-surface">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              Bienvenido{user?.fullName ? `, ${user.fullName}` : ''}. Aquí tienes una vista rápida de ingresos, citas y reputación.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">{user?.subscription?.type || 'FREE'}</span>
            <span className="rounded-full border border-outline-variant/40 bg-surface-container px-3 py-1">{new Date().toLocaleDateString('es-ES')}</span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Actividad</p>
                <h2 className="mt-1 text-xl font-semibold text-on-surface">Hoy en tu agenda</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-on-surface-variant md:auto-cols-max md:grid-flow-col">
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em]">Ingresos semana</p>
                  <p className="mt-1 text-on-surface">{formatMoney(data.week?.totalIncome)}</p>
                </div>
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em]">Promedio diario</p>
                  <p className="mt-1 text-on-surface">{formatMoney(data.week?.dailyAverage)}</p>
                </div>
              </div>
            </div>
          </div>

          <AppointmentTable appointments={appointments} onStatusChange={updateAppointmentStatus} />
          {appointmentsLoading && (
            <p className="px-1 text-sm text-on-surface-variant">Actualizando citas...</p>
          )}
        </div>

        <aside className="space-y-6">
          <SubscriptionBanner subscription={user?.subscription} />

          <div className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
            <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Próxima cita</p>
            {data.nextAppointment ? (
              <div className="mt-4 space-y-2">
                <p className="text-3xl font-bold text-primary">{data.nextAppointment.time}</p>
                <p className="text-sm text-on-surface">{data.nextAppointment.client}</p>
                <p className="text-sm text-on-surface-variant">{data.nextAppointment.service}</p>
                <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  En {data.nextAppointment.timeLeft}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-on-surface-variant">No hay citas próximas confirmadas.</p>
            )}
          </div>

          <div className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
            <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Reseñas recientes</p>
            <div className="mt-4 space-y-3">
              {data.reputation?.recent?.length ? (
                data.reputation.recent.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-outline-variant/40 bg-surface-container px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-on-surface">{review.client}</p>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{review.rating}/5</span>
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">{review.comment || 'Sin comentario'}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant">Aún no hay reseñas recientes.</p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
