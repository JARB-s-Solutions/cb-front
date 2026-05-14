// src/components/Dashboard/IncomeChart.jsx

/**
 * Componente de gráfico de ingresos.
 * Para v1, mostramos una tabla simple de datos.
 * Puedes reemplazar con recharts o chart.js cuando necesites.
 */
export function IncomeChart({ data }) {
  if (!data) return null

  const maxValue = Math.max(
    ...data.cash,
    ...data.transfer
  )
  const scale = 100 / maxValue

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-black mb-6">Ingresos Últimos 7 Días</h3>

      {/* Gráfico de barras simple */}
      <div className="space-y-4">
        {data.labels.map((label, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-sm font-semibold text-black">
                ${(data.cash[idx] + data.transfer[idx]).toFixed(2)}
              </p>
            </div>

            {/* Barras */}
            <div className="h-8 bg-gray-100 rounded flex overflow-hidden gap-1">
              {/* Efectivo */}
              <div
                className="bg-gray-700 rounded-l"
                style={{
                  width: `${(data.cash[idx] * scale) / 2}%`,
                  minWidth: data.cash[idx] > 0 ? '4px' : '0',
                }}
                title={`Efectivo: $${data.cash[idx]}`}
              ></div>

              {/* Digital */}
              <div
                className="bg-red-600"
                style={{
                  width: `${(data.transfer[idx] * scale) / 2}%`,
                  minWidth: data.transfer[idx] > 0 ? '4px' : '0',
                }}
                title={`Digital: $${data.transfer[idx]}`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex gap-6 mt-8 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-700 rounded"></div>
          <span className="text-sm text-gray-600">Efectivo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded"></div>
          <span className="text-sm text-gray-600">Digital</span>
        </div>
      </div>
    </div>
  )
}
