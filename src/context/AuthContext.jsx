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
  const [isLoading, setIsLoading] = useState(false)

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
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        // Token expirado o inválido
        setUser(null)
        localStorage.removeItem('barberId')
        localStorage.removeItem('authUser')
      } else {
        console.error('checkAuth error:', error.message)
      }
      return null
    }
  }, [])

  // Solo sincronizar con el backend si es necesario (ej: después de logout remoto)
  // La persistencia se mantiene con localStorage
  useEffect(() => {
    // Si no hay usuario en localStorage, no hacemos nada
    // El usuario estará en null y ProtectedRoute redirigirá al login
    if (!user) {
      setIsLoading(false)
    }
  }, [user])

  // Cerrar sesión
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Error al cerrar sesión', error)
    } finally {
      setUser(null)
      localStorage.removeItem('barberId')
      localStorage.removeItem('authUser')
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, checkAuth, logout, setUserData }}>
      {children}
    </AuthContext.Provider>
  )
}