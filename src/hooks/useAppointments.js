// src/hooks/useAppointments.js

import { useState, useCallback } from 'react'
import { api } from '../config/axios'

export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAppointments = useCallback(async (params = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/appointments', { params })
      setAppointments(Array.isArray(response.data) ? response.data : (response.data.data || []))
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar citas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createAppointment = useCallback(async (appointmentData) => {
    try {
      setError(null)
      const response = await api.post('/appointments', appointmentData)
      setAppointments(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating appointment:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al crear cita')
      throw err
    }
  }, [])

  const updateAppointmentStatus = useCallback(async (id, status) => {
    try {
      setError(null)
      const response = await api.patch(`/appointments/${id}/status`, { status })
      setAppointments(prev =>
        prev.map(apt => (apt.id === id ? (response.data.appointment || response.data) : apt))
      )
      return response.data
    } catch (err) {
      console.error('Error updating appointment status:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al actualizar cita')
      throw err
    }
  }, [])

  const cancelAppointment = useCallback(async (id) => {
    try {
      setError(null)
      const response = await updateAppointmentStatus(id, 'CANCELLED')
      setAppointments(prev =>
        prev.map(apt => (apt.id === id ? (response.appointment || response) : apt))
      )
      return response
    } catch (err) {
      console.error('Error cancelling appointment:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cancelar cita')
      throw err
    }
  }, [updateAppointmentStatus])

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
  }
}
