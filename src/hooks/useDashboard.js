// src/hooks/useDashboard.js

import { useState, useCallback } from 'react'
import { api } from '../config/axios'

export function useDashboard() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/dashboard/stats')
      setData(response.data)
    } catch (err) {
      console.error('Error fetching dashboard:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar el dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { data, isLoading, error, refreshDashboard: fetchDashboard }
}
