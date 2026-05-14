import { useEffect, useState } from 'react'
import { api } from '../config/axios'

export function ReportsPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/finance/summary')
      .then(res => setSummary(res.data))
      .catch(err => setError(err.response?.data?.error || 'No se pudo cargar el resumen financiero'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Cargando reportes...</div>
  if (error) return <div className="p-6 text-red-400">{error}</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Resumen Financiero</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
          <p className="text-sm text-gray-400">Ingresos hoy</p>
          <p className="text-2xl font-bold text-white">${summary?.todayTotal ?? 0}</p>
        </div>
        <div className="p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
          <p className="text-sm text-gray-400">Transacciones</p>
          <p className="text-2xl font-bold text-white">{summary?.transactionsCount ?? 0}</p>
        </div>
        <div className="p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
          <p className="text-sm text-gray-400">Balance</p>
          <p className="text-2xl font-bold text-white">${summary?.balance ?? 0}</p>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
