import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../config/axios'
import { BookingModal } from '../components/BookingModal'

export function BarberProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    api.get(`/barbers/${id}`)
      .then(res => setData(res.data))
      .catch(err => {
        console.error('Error fetching barber profile:', err?.response?.data || err.message)
        setError(err.response?.data?.error || 'No se pudo cargar el perfil del barbero')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <button onClick={() => navigate('/barberos')} className="text-primary hover:underline mb-4">← Volver</button>
        <div className="bg-gray-800/30 rounded-lg p-12 animate-pulse">
          <div className="h-20 bg-gray-700 rounded-full w-20 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <button onClick={() => navigate('/barberos')} className="text-primary hover:underline mb-4">← Volver</button>
        <div className="p-6 bg-red-900/20 border border-red-600 rounded-lg">
          <p className="text-red-400">⚠️ {error}</p>
          <button
            onClick={() => navigate('/barberos')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-red-700 transition-colors"
          >
            Ir al marketplace
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { profile, services = [], gallery = [], reviews = [] } = data

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-container-low to-background">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header con navegación */}
        <button onClick={() => navigate('/barberos')} className="text-primary hover:underline text-sm flex items-center gap-1">
          ← Volver al marketplace
        </button>

        {/* Perfil del barbero */}
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-red-600 overflow-hidden flex-shrink-0">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-white text-3xl font-bold">
                  {(profile?.name || 'B').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{profile?.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="text-white font-semibold">{profile?.rating ? Number(profile.rating).toFixed(1) : 'N/A'}</span>
                  <span className="text-gray-400 text-sm">({profile?.reviewCount} reseñas)</span>
                </div>
                <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">{profile?.plan}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a href={`tel:${profile?.phone}`} className="px-4 py-2 bg-primary hover:bg-red-700 text-white rounded-lg transition-colors">
                  📞 Llamar
                </a>
                <button className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  Reservar ahora
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Servicios */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Servicios</h2>
          {services.length === 0 ? (
            <p className="text-gray-400">No hay servicios publicados.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map(s => (
                <div key={s.id} className="p-4 bg-[#0f0f0f] rounded-lg border border-gray-800 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{s.name}</h3>
                    <span className="text-red-500 font-bold text-lg">${s.price}</span>
                  </div>
                  <p className="text-sm text-gray-400">⏱️ {s.durationMin} minutos</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Galería */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Galería de trabajos</h2>
          {gallery.length === 0 ? (
            <p className="text-gray-400">No hay fotos publicadas.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map(img => (
                <div key={img.id} className="aspect-square rounded-lg overflow-hidden bg-gray-800 hover:shadow-lg transition-shadow">
                  <img src={img.imageUrl} alt="galería" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reseñas */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Reseñas de clientes</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-400">Aún no hay reseñas públicas.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-white">{r.author}</p>
                      <p className="text-xs text-gray-500">{r.serviceName}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-bold text-white">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Final */}
        <div className="flex gap-3 py-6">
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="flex-1 py-3 bg-primary hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Agendar cita
          </button>
          <button className="flex-1 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg font-semibold transition-colors">
            Compartir
          </button>
        </div>
      </div>

      {/* Booking Modal - Fuera del contenedor */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        barber={profile}
        services={services}
      />
    </div>
  )
}

export default BarberProfilePage
