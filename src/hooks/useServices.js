// src/hooks/useServices.js

import { useState, useCallback } from 'react'
import { api } from '../config/axios'

export function useServices() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/services')
      setServices(Array.isArray(response.data) ? response.data : (response.data.data || []))
    } catch (err) {
      console.error('Error fetching services:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar servicios')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createService = useCallback(async (serviceData) => {
    try {
      setError(null)
      const response = await api.post('/services', serviceData)
      setServices(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating service:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al crear servicio')
      throw err
    }
  }, [])

  const updateService = useCallback(async (id, updateData) => {
    try {
      setError(null)
      const response = await api.put(`/services/${id}`, updateData)
      const updatedService = { id, ...updateData }
      setServices(prev => prev.map(svc => (svc.id === id ? { ...svc, ...updateData } : svc)))
      return response.data?.service || updatedService
    } catch (err) {
      console.error('Error updating service:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al actualizar servicio')
      throw err
    }
  }, [])

  const deleteService = useCallback(async (id) => {
    try {
      setError(null)
      await api.delete(`/services/${id}`)
      setServices(prev => prev.filter(svc => svc.id !== id))
    } catch (err) {
      console.error('Error deleting service:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al eliminar servicio')
      throw err
    }
  }, [])

  return {
    services,
    isLoading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  }
}
