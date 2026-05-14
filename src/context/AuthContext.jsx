import { useState, useEffect, useCallback } from 'react'
import { api } from '../config/axios'
import { AuthContext } from './authContextValue'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('authUser')

    if (!cachedUser) {
      return null
    }

    try {
      return JSON.parse(cachedUser)
    } catch {
      localStorage.removeItem('authUser')
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  const setUserData = (userData) => {
    setUser(userData)
    if (userData?.id) {
      localStorage.setItem('barberId', userData.id)
      localStorage.setItem('authUser', JSON.stringify(userData))
      console.log('[AuthContext] User data establecido:', userData.id)
    }
  }

  // Obtener perfil y guardar barberId
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile')
      setUserData(response.data)
      console.log('checkAuth - user response:', response.data)
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error('checkAuth error:', error.message)
      }
      setUser(null)
      localStorage.removeItem('barberId')
      localStorage.removeItem('authUser')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth()
    }

    void initializeAuth()
  }, [checkAuth])

  // Cerrar sesión
  const logout = async () => {
    try {
      await api.post('/auth/logout')
      setUser(null)
      localStorage.removeItem('barberId')
      localStorage.removeItem('authUser')
    } catch (error) {
      console.error('Error al cerrar sesión', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, checkAuth, logout, setUserData }}>
      {children}
    </AuthContext.Provider>
  )
}