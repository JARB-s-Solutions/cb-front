import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useAppointments } from '../hooks/useAppointments'
import { useServices } from '../hooks/useServices'
import { AppointmentTable } from '../components/Dashboard/AppointmentTable'

const today = new Date().toISOString().slice(0, 10)

const initialForm = {
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  serviceId: '',
  dateTime: '',
}

export function AppointmentsPage() {
  const { user } = useAuth()
  const { appointments, isLoading, error, fetchAppointments, createAppointment, updateAppointmentStatus } = useAppointments()
  const { services, fetchServices } = useServices()
  const [view, setView] = useState('calendar')
  const [dateFilter, setDateFilter] = useState(today)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchAppointments({ date: dateFilter })
  }, [fetchAppointments, dateFilter])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const summary = useMemo(() => {
    const total = appointments.length
    const pending = appointments.filter((item) => item.status === 'PENDING' || item.status === 'CONFIRMED').length
    const completed = appointments.filter((item) => item.status === 'COMPLETED').length
    return { total, pending, completed }
  }, [appointments])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const openCreateModal = () => {
    setForm((prev) => ({ ...prev, dateTime: `${dateFilter}T10:00` }))
    setIsModalOpen(true)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await createAppointment({
        barberId: user?.id,
        serviceId: Number(form.serviceId),
        date: new Date(form.dateTime).toISOString(),
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        clientEmail: form.clientEmail,
      })

      setIsModalOpen(false)
      setForm(initialForm)
      await fetchAppointments({ date: dateFilter })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative z-10 space-y-6 px-4 py-6 md:px-6 lg:px-8">
      <header className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant">Agenda</p>
            <h1 className="mt-2 text-3xl font-bold text-on-surface">Gestión de Citas</h1>
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              Lista real conectada al backend. Puedes crear citas, confirmarlas, completarlas o cancelarlas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={openCreateModal}
              className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-on-primary transition-colors hover:bg-primary-fixed"
            >
              + Nueva Cita
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: 'Total', value: summary.total, icon: '📅' },
          { label: 'Pendientes', value: summary.pending, icon: '⏳' },
          { label: 'Completadas', value: summary.completed, icon: '✅' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-outline-variant/50 bg-surface-container-low p-5 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-on-surface-variant">{item.label}</p>
              <span className="text-xl">{item.icon}</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-on-surface">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] md:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {[
            { key: 'calendar', label: 'Calendario' },
            { key: 'list', label: 'Lista' },
            { key: 'month', label: 'Mes' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                view === item.key
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant/50 bg-surface-container text-on-surface-variant hover:border-primary/30 hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-on-surface-variant">Cargando citas...</div>
        ) : error ? (
          <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-error">{error}</div>
        ) : view === 'list' ? (
          <AppointmentTable appointments={appointments} onStatusChange={updateAppointmentStatus} />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl border border-outline-variant/40 bg-surface-container px-6 py-10 text-center text-on-surface-variant">
              <p className="text-lg font-medium text-on-surface">Vista {view === 'calendar' ? 'Calendario' : 'Mes'}</p>
              <p className="mt-2 text-sm">En este MVP mostramos la agenda del día y el control de estados. El calendario completo puede crecer después sobre este contrato.</p>
            </div>
            <div className="rounded-3xl border border-outline-variant/40 bg-surface-container p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Citas del día</p>
              <div className="mt-4 space-y-3">
                {appointments.length ? (
                  appointments.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3">
                      <p className="font-medium text-on-surface">{item.client?.name || item.clientName || '-'}</p>
                      <p className="text-sm text-on-surface-variant">{item.service?.name || item.serviceName || '-'}</p>
                      <p className="mt-1 text-xs text-primary">{new Date(item.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-on-surface-variant">No hay citas en esta fecha.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Nueva cita</p>
                <h2 className="mt-1 text-2xl font-bold text-on-surface">Crear reserva</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full border border-outline-variant/50 px-3 py-1 text-sm text-on-surface-variant hover:text-on-surface">
                Cerrar
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-6 grid gap-4 md:grid-cols-2">
              <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Nombre del cliente" className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required />
              <input name="clientPhone" value={form.clientPhone} onChange={handleChange} placeholder="Teléfono" className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required />
              <input name="clientEmail" value={form.clientEmail} onChange={handleChange} placeholder="Correo opcional" className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <select name="serviceId" value={form.serviceId} onChange={handleChange} className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required>
                <option value="">Selecciona un servicio</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name} · {service.durationMin} min</option>
                ))}
              </select>
              <input name="dateTime" type="datetime-local" value={form.dateTime} onChange={handleChange} className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:col-span-2" required />

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-outline-variant/50 px-4 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? 'Guardando...' : 'Crear cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
