import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useServices } from '../hooks/useServices'

const initialForm = {
  name: '',
  price: '',
  durationMin: '',
}

export function ServicesPage() {
  const { user } = useAuth()
  const { services, isLoading, error, fetchServices, createService, updateService, deleteService } = useServices()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const serviceCount = services.length
  const planType = user?.subscription?.type || 'FREE'
  const maxServices = planType === 'FREE' ? 5 : 'ilimitados'

  const summary = useMemo(() => {
    const totalPrice = services.reduce((acc, item) => acc + Number(item.price || 0), 0)
    return { totalPrice }
  }, [services])

  const openCreateModal = () => {
    setEditingService(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (service) => {
    setEditingService(service)
    setForm({
      name: service.name || '',
      price: String(service.price ?? ''),
      durationMin: String(service.durationMin ?? ''),
    })
    setIsModalOpen(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    const payload = {
      name: form.name,
      price: Number(form.price),
      durationMin: Number(form.durationMin),
    }

    try {
      if (editingService) {
        await updateService(editingService.id, payload)
      } else {
        await createService(payload)
      }

      setIsModalOpen(false)
      setEditingService(null)
      setForm(initialForm)
      await fetchServices()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (serviceId) => {
    if (!window.confirm('¿Desactivar este servicio? Podrás dejar de ofrecerlo inmediatamente.')) {
      return
    }

    await deleteService(serviceId)
    await fetchServices()
  }

  return (
    <div className="relative z-10 space-y-6 px-4 py-6 md:px-6 lg:px-8">
      <header className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant">Catálogo</p>
            <h1 className="mt-2 text-3xl font-bold text-on-surface">Mis Servicios</h1>
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              Gestiona tus cortes y servicios. El plan {planType} permite {maxServices} servicios activos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
              <p className="text-[11px] uppercase tracking-[0.2em]">Servicios activos</p>
              <p className="mt-1 text-on-surface">{serviceCount}</p>
            </div>
            <button onClick={openCreateModal} className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-on-primary transition-colors hover:bg-primary-fixed">
              + Agregar nuevo servicio
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: 'Activos', value: serviceCount, icon: '✂️' },
          { label: 'Precio total', value: `$${summary.totalPrice.toFixed(2)}`, icon: '💵' },
          { label: 'Plan', value: planType, icon: '🎯' },
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
        {isLoading ? (
          <div className="py-16 text-center text-on-surface-variant">Cargando servicios...</div>
        ) : error ? (
          <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-error">{error}</div>
        ) : services.length ? (
          <div className="overflow-hidden rounded-2xl border border-outline-variant/40">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-highest/40">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-on-surface-variant">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold text-on-surface-variant">Duración</th>
                  <th className="px-4 py-3 text-left font-semibold text-on-surface-variant">Precio</th>
                  <th className="px-4 py-3 text-right font-semibold text-on-surface-variant">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-t border-outline-variant/30 transition-colors hover:bg-surface-container-highest/40">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-on-surface">{service.name}</p>
                        <p className="text-xs text-on-surface-variant">Activo</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant">{service.durationMin} min</td>
                    <td className="px-4 py-4 text-primary">${Number(service.price).toFixed(2)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => openEditModal(service)} className="text-xs font-medium text-primary hover:text-primary-fixed">Editar</button>
                        <button onClick={() => handleDelete(service.id)} className="text-xs font-medium text-error hover:text-on-error-container">Desactivar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-outline-variant/40 bg-surface-container px-6 py-12 text-center text-on-surface-variant">
            <p className="text-lg font-medium text-on-surface">Aún no has agregado servicios</p>
            <p className="mt-2 text-sm">Crea tu primer servicio para comenzar a ofrecer reservas.</p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Servicio</p>
                <h2 className="mt-1 text-2xl font-bold text-on-surface">{editingService ? 'Editar servicio' : 'Nuevo servicio'}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full border border-outline-variant/50 px-3 py-1 text-sm text-on-surface-variant hover:text-on-surface">
                Cerrar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre del servicio" className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:col-span-2" required />
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="Precio" className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required />
              <input name="durationMin" type="number" min="5" step="5" value={form.durationMin} onChange={handleChange} placeholder="Duración en minutos" className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required />

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-outline-variant/50 px-4 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? 'Guardando...' : editingService ? 'Guardar cambios' : 'Crear servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
