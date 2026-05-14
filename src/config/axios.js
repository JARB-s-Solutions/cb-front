import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://controlbarber-backend.vercel.app/api')

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

api.interceptors.request.use((config) => config, (error) => Promise.reject(error))

// Exportar como default también para compatibilidad
export default api