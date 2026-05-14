import { useEffect, useState } from 'react'
import { api } from '../config/axios'
import { Link } from 'react-router-dom'

export function MarketplacePage() {
  const [barbers, setBarbers] = useState([])
  const [filteredBarbers, setFilteredBarbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoading(true)
        const res = await api.get('/barbers/top')
        setBarbers(res.data || [])
        setFilteredBarbers(res.data || [])
      } catch (err) {
        console.error('Error fetching barbers:', err)
        setError(err.response?.data?.error || 'No se pudieron cargar los barberos')
      } finally {
        setLoading(false)
      }
    }
    fetchBarbers()
  }, [])

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredBarbers(barbers)
    } else {
      const filtered = barbers.filter(b =>
        b.name.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredBarbers(filtered)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Barberos Disponibles</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-4 bg-gray-800 rounded-lg animate-pulse h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">Barberos Disponibles</h1>
        <div className="p-6 bg-red-900/20 border border-red-600 rounded-lg">
          <p className="text-red-400">⚠️ {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Barberos Disponibles</h1>
        <p className="text-gray-400 text-sm">Encuentra y reserva con los mejores barberos</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar barbero..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-surface-container-highest border border-outline-variant text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="text-sm text-gray-400">{filteredBarbers.length} resultado(s)</span>
      </div>

      {filteredBarbers.length === 0 ? (
        <div className="text-center p-12 bg-gray-800/30 rounded-lg">
          <p className="text-gray-400 text-lg">No se encontraron barberos</p>
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBarbers.map(b => (
            <Link
              key={b.id}
              to={`/barberos/${b.slug || b.id}`}
              className="p-4 bg-[#141414] rounded-lg border border-gray-800 hover:border-primary hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                  {b.avatar ? (
                    <img src={b.avatar} alt={b.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white text-xl font-bold bg-gradient-to-br from-primary to-red-600">
                      {(b.name || 'B').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{b.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-sm text-gray-300">{b.rating ? b.rating.toFixed(1) : 'N/A'}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{b.reviewCount || 0} reseñas</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <button className="w-full py-2 bg-primary hover:bg-red-700 text-white text-sm font-medium rounded transition-colors">
                  Ver perfil
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MarketplacePage
