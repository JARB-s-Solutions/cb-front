import { useState, useEffect } from 'react'
import { useBooking } from '../hooks/useBooking'

export function BookingModal({ isOpen, onClose, barber, services }) {
  const { createBooking, checkAvailability, loading, error, setError } = useBooking()
  const [step, setStep] = useState('service') // service, date, form, success
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: ''
  })
  const [successMsg, setSuccessMsg] = useState('')

  // Calcular fecha mínima (hoy + 1 día)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Cargar slots disponibles cuando se selecciona fecha
  useEffect(() => {
    if (selectedDate && selectedService) {
      loadAvailableSlots()
    }
  }, [selectedDate, selectedService])

  const loadAvailableSlots = async () => {
    setSlotsLoading(true)
    try {
      const slots = await checkAvailability(barber.id, selectedService.id, selectedDate)
      setAvailableSlots(slots)
      setSelectedTime('')
    } catch (err) {
      console.error('Error loading slots:', err)
      setAvailableSlots([])
    } finally {
      setSlotsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedService || !selectedDate || !selectedTime || !formData.clientName || !formData.clientPhone) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    try {
      await createBooking({
        barberId: barber.id,
        serviceId: selectedService.id,
        date: `${selectedDate}T${selectedTime}:00Z`,
        ...formData
      })
      setSuccessMsg('¡Cita agendada exitosamente! El barbero la confirmará pronto.')
      setTimeout(() => {
        onClose()
        setStep('service')
        setSelectedService(null)
        setSelectedDate('')
        setSelectedTime('')
        setFormData({ clientName: '', clientPhone: '', clientEmail: '' })
        setSuccessMsg('')
      }, 2000)
    } catch (err) {
      // Error ya está en el estado
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#0f0f0f]">
          <h2 className="text-xl font-bold text-white">Agendar cita con {barber?.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <div className="p-6">
          {/* Paso 1: Seleccionar Servicio */}
          {step === 'service' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Paso 1 de 3: Selecciona un servicio</p>
              {services.length === 0 ? (
                <p className="text-gray-400">No hay servicios disponibles.</p>
              ) : (
                <div className="space-y-2">
                  {services.map(service => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service)
                        setStep('date')
                      }}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedService?.id === service.id
                          ? 'bg-primary border-primary text-white'
                          : 'bg-gray-800 border-gray-700 text-white hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm text-gray-300">${service.price} · {service.durationMin} min</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 2: Seleccionar Fecha y Hora */}
          {step === 'date' && selectedService && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Paso 2 de 3: Selecciona fecha y hora</p>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Fecha</label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {selectedDate && (
                <>
                  {slotsLoading ? (
                    <p className="text-gray-400 text-center py-4">Cargando horarios disponibles...</p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No hay horarios disponibles para esta fecha.</p>
                  ) : (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Hora</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`p-2 rounded-lg border transition-all text-sm ${
                              selectedTime === slot
                                ? 'bg-primary border-primary text-white'
                                : 'bg-gray-800 border-gray-700 text-white hover:border-primary'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setStep('service')}
                  className="flex-1 px-4 py-2 border border-gray-700 text-white rounded-lg hover:border-primary transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep('form')}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Datos del Cliente */}
          {step === 'form' && selectedService && selectedDate && selectedTime && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-400 text-sm">Paso 3 de 3: Tus datos</p>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email (opcional)</label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Resumen */}
              <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Resumen de tu cita:</p>
                <p className="text-white font-semibold">{selectedService.name}</p>
                <p className="text-sm text-gray-400">{selectedDate} a las {selectedTime}</p>
                <p className="text-sm text-gray-400">${selectedService.price}</p>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('date')}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-700 text-white rounded-lg hover:border-primary disabled:opacity-50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? '⏳ Agendando...' : '✓ Confirmar'}
                </button>
              </div>
            </form>
          )}

          {/* Éxito */}
          {successMsg && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✓</div>
              <p className="text-green-400 font-semibold">{successMsg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
