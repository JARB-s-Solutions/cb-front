import { formatTime } from '../../utils/dateUtils'

const statusStyles = {
  PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  CONFIRMED: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400' },
  COMPLETED: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
  NO_SHOW: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
}

const statusLabels = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No llegó',
}

export function AppointmentTable({ appointments = [], onStatusChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-low shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
      {/* Header */}
      <div className="border-b border-outline-variant/40 bg-surface-container px-6 py-4">
        <h3 className="font-semibold text-on-surface">Citas de Hoy</h3>
      </div>

      {/* Tabla */}
      {appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant/40 bg-surface-container-highest/40">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-on-surface-variant">
                  Hora
                </th>
                <th className="px-6 py-3 text-left font-medium text-on-surface-variant">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left font-medium text-on-surface-variant">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left font-medium text-on-surface-variant">
                  Estado
                </th>
                <th className="px-6 py-3 text-right font-medium text-on-surface-variant">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => {
                const style = statusStyles[apt.status] || statusStyles.PENDING
                const clientName = apt.clientName || apt.client?.name || '-'
                const serviceName = apt.service?.name || apt.serviceName || (typeof apt.service === 'string' ? apt.service : '-')
                return (
                  <tr
                    key={apt.id}
                    className="border-b border-outline-variant/30 transition-colors hover:bg-surface-container-highest/40"
                  >
                    <td className="px-6 py-4 font-medium text-on-surface">
                      {apt.time || formatTime(apt.date)}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {clientName}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{serviceName}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${style.bg}`}>
                        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                        <span className={`text-xs font-medium ${style.text}`}>
                          {statusLabels[apt.status]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {onStatusChange ? (
                        <div className="flex justify-end gap-2">
                          {apt.status !== 'CONFIRMED' && (
                            <button onClick={() => onStatusChange(apt.id, 'CONFIRMED')} className="text-xs font-medium text-primary hover:text-primary-fixed">Confirmar</button>
                          )}
                          {apt.status !== 'COMPLETED' && (
                            <button onClick={() => onStatusChange(apt.id, 'COMPLETED')} className="text-xs font-medium text-on-surface-variant hover:text-on-surface">Completar</button>
                          )}
                          {apt.status !== 'CANCELLED' && (
                            <button onClick={() => onStatusChange(apt.id, 'CANCELLED')} className="text-xs font-medium text-error hover:text-on-error-container">Cancelar</button>
                          )}
                        </div>
                      ) : (
                        <button className="text-sm font-medium text-primary hover:text-primary-fixed">
                          Ver detalles
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-8 text-center text-on-surface-variant">
          <p className="text-sm">No hay citas programadas para hoy</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-outline-variant/40 bg-surface-container px-6 py-4 text-right">
        <a
          href="/citas"
          className="text-sm font-medium text-primary hover:text-primary-fixed"
        >
          Ver agenda completa →
        </a>
      </div>
    </div>
  )
}
