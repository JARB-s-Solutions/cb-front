import { useState } from 'react'
import { api } from '../config/axios'

export const useBooking = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createBooking = async (bookingData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/appointments', {
        barberId: bookingData.barberId,
        serviceId: bookingData.serviceId,
        date: bookingData.date,
        clientName: bookingData.clientName,
        clientPhone: bookingData.clientPhone,
        clientEmail: bookingData.clientEmail || ''
      })
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Error al agendar cita'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = async (barberId, serviceId, date) => {
    try {
      const response = await api.get('/appointments/availability', {
        params: {
          barberId,
          serviceId,
          date
        }
      })
      return response.data.slots || []
    } catch (err) {
      console.error('Error checking availability:', err)
      return []
    }
  }

  return {
    loading,
    error,
    createBooking,
    checkAvailability,
    setError
  }
}
