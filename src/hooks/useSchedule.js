// src/hooks/useSchedule.js

import { useState, useCallback } from 'react'
import { api } from '../config/axios'

export function useSchedule() {
  const [schedules, setSchedules] = useState([])
  const [blocks, setBlocks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSchedules = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/schedule')
      const nextSchedules = Array.isArray(response.data) ? response.data : (response.data.data || [])
      setSchedules(nextSchedules)
      return nextSchedules
    } catch (err) {
      console.error('Error fetching schedules:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar horarios')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchBlocks = useCallback(async () => {
    try {
      setError(null)
      const response = await api.get('/blocks')
      const nextBlocks = Array.isArray(response.data) ? response.data : (response.data.data || [])
      setBlocks(nextBlocks)
      return nextBlocks
    } catch (err) {
      console.error('Error fetching blocks:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar bloqueos')
      return []
    }
  }, [])

  const updateSchedule = useCallback(async (scheduleData) => {
    try {
      setError(null)
      const response = await api.put('/schedule', scheduleData)
      const nextSchedules = Array.isArray(response.data.data) ? response.data.data : (response.data || [])
      setSchedules(nextSchedules)
      return response.data
    } catch (err) {
      console.error('Error updating schedule:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al actualizar horario')
      throw err
    }
  }, [])

  const createBlock = useCallback(async (blockData) => {
    try {
      setError(null)
      const response = await api.post('/blocks', blockData)
      setBlocks(prev => [...prev, response.data.block || response.data])
      return response.data
    } catch (err) {
      console.error('Error creating block:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al crear bloqueo')
      throw err
    }
  }, [])

  const deleteBlock = useCallback(async (blockId) => {
    try {
      setError(null)
      await api.delete(`/blocks/${blockId}`)
      setBlocks(prev => prev.filter(block => block.id !== blockId))
    } catch (err) {
      console.error('Error deleting block:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al eliminar bloqueo')
      throw err
    }
  }, [])

  const closeDay = useCallback(async (payload) => {
    try {
      setError(null)
      const response = await api.post('/blocks/close-day', payload)
      return response.data
    } catch (err) {
      console.error('Error closing day:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cerrar el día')
      throw err
    }
  }, [])

  return {
    schedules,
    blocks,
    isLoading,
    error,
    fetchSchedules,
    fetchBlocks,
    updateSchedule,
    createBlock,
    deleteBlock,
    closeDay,
  }
}
