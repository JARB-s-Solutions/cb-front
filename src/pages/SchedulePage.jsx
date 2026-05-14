import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSchedule } from '../hooks/useSchedule'
import { DAYS_OF_WEEK } from '../types/schedule.types'

const createDefaultSchedule = (dayOfWeek) => ({
  dayOfWeek,
  startTime: '09:00',
  endTime: '18:00',
  breakStart: '13:00',
  breakEnd: '14:00',
  isWorkDay: dayOfWeek !== 0,
})

const formatDateTimeLocal = (value) => {
  try {
    const date = new Date(value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch {
    return value
  }
}

export function SchedulePage() {
  const { blocks, isLoading, error, fetchSchedules, fetchBlocks, updateSchedule, createBlock, deleteBlock } = useSchedule()
  const [draftSchedules, setDraftSchedules] = useState([])
  const [blockForm, setBlockForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isCreatingBlock, setIsCreatingBlock] = useState(false)

  const hydrateDraftSchedules = useCallback((sourceSchedules) => {
    const merged = DAYS_OF_WEEK.map((_, dayOfWeek) => {
      const existing = sourceSchedules.find((item) => item.dayOfWeek === dayOfWeek)
      return existing || createDefaultSchedule(dayOfWeek)
    })

    setDraftSchedules(merged)
  }, [])

  const loadScheduleData = useCallback(async () => {
    const loadedSchedules = await fetchSchedules()
    await fetchBlocks()
    hydrateDraftSchedules(Array.isArray(loadedSchedules) ? loadedSchedules : [])
  }, [fetchBlocks, fetchSchedules, hydrateDraftSchedules])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadScheduleData()
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [loadScheduleData])

  const workDayCount = useMemo(() => draftSchedules.filter((item) => item.isWorkDay).length, [draftSchedules])

  const handleScheduleChange = (dayOfWeek, field, value) => {
    setDraftSchedules((prev) => prev.map((item) => (item.dayOfWeek === dayOfWeek ? { ...item, [field]: value } : item)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await updateSchedule(draftSchedules)
      hydrateDraftSchedules(Array.isArray(response?.data?.data) ? response.data.data : [])
    } finally {
      setIsSaving(false)
    }
  }

  const handleBlockFormChange = (event) => {
    const { name, value } = event.target
    setBlockForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateBlock = async (event) => {
    event.preventDefault()
    setIsCreatingBlock(true)
    try {
      await createBlock({
        startDate: new Date(blockForm.startDate).toISOString(),
        endDate: new Date(blockForm.endDate).toISOString(),
        reason: blockForm.reason,
      })
      setBlockForm({ startDate: '', endDate: '', reason: '' })
      await fetchBlocks()
    } finally {
      setIsCreatingBlock(false)
    }
  }

  const handleDeleteBlock = async (blockId) => {
    if (!window.confirm('¿Eliminar este bloqueo?')) {
      return
    }

    await deleteBlock(blockId)
    await fetchBlocks()
  }

  return (
    <div className="relative z-10 space-y-6 px-4 py-6 md:px-6 lg:px-8">
      <header className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant">Disponibilidad</p>
            <h1 className="mt-2 text-3xl font-bold text-on-surface">Mis Horarios</h1>
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              Configura tu semana y los bloqueos excepcionales. Esta información alimenta la disponibilidad de citas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-on-surface-variant md:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em]">Días laborables</p>
              <p className="mt-1 text-on-surface">{workDayCount} / 7</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em]">Bloqueos</p>
              <p className="mt-1 text-on-surface">{blocks.length}</p>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="rounded-2xl bg-primary px-4 py-3 font-semibold text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-70">
              {isSaving ? 'Guardando...' : 'Guardar semana'}
            </button>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] md:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Semana</p>
            <h2 className="mt-1 text-xl font-semibold text-on-surface">Configuración semanal</h2>
          </div>
        </div>

        {isLoading && !draftSchedules.length ? (
          <div className="py-16 text-center text-on-surface-variant">Cargando horarios...</div>
        ) : error ? (
          <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-error">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {draftSchedules.map((day) => (
              <div key={day.dayOfWeek} className="rounded-3xl border border-outline-variant/40 bg-surface-container p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-on-surface">{DAYS_OF_WEEK[day.dayOfWeek]}</p>
                    <p className="text-xs text-on-surface-variant">Horario y descanso</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-highest px-3 py-2 text-xs text-on-surface-variant">
                    <input type="checkbox" checked={day.isWorkDay} onChange={(event) => handleScheduleChange(day.dayOfWeek, 'isWorkDay', event.target.checked)} className="h-4 w-4 accent-[#aec6ff]" />
                    {day.isWorkDay ? 'Laborable' : 'Cerrado'}
                  </label>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-sm text-on-surface-variant">
                    <span className="block text-[11px] uppercase tracking-[0.2em]">Apertura</span>
                    <input type="time" value={day.startTime || '09:00'} onChange={(event) => handleScheduleChange(day.dayOfWeek, 'startTime', event.target.value)} disabled={!day.isWorkDay} className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60" />
                  </label>
                  <label className="space-y-1 text-sm text-on-surface-variant">
                    <span className="block text-[11px] uppercase tracking-[0.2em]">Cierre</span>
                    <input type="time" value={day.endTime || '18:00'} onChange={(event) => handleScheduleChange(day.dayOfWeek, 'endTime', event.target.value)} disabled={!day.isWorkDay} className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60" />
                  </label>
                  <label className="space-y-1 text-sm text-on-surface-variant">
                    <span className="block text-[11px] uppercase tracking-[0.2em]">Descanso inicio</span>
                    <input type="time" value={day.breakStart || ''} onChange={(event) => handleScheduleChange(day.dayOfWeek, 'breakStart', event.target.value)} disabled={!day.isWorkDay} className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60" />
                  </label>
                  <label className="space-y-1 text-sm text-on-surface-variant">
                    <span className="block text-[11px] uppercase tracking-[0.2em]">Descanso fin</span>
                    <input type="time" value={day.breakEnd || ''} onChange={(event) => handleScheduleChange(day.dayOfWeek, 'breakEnd', event.target.value)} disabled={!day.isWorkDay} className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] xl:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Excepciones</p>
              <h2 className="mt-1 text-xl font-semibold text-on-surface">Bloqueos programados</h2>
            </div>
          </div>

          <form onSubmit={handleCreateBlock} className="mt-5 grid gap-3 md:grid-cols-2">
            <input type="datetime-local" name="startDate" value={blockForm.startDate} onChange={handleBlockFormChange} className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required />
            <input type="datetime-local" name="endDate" value={blockForm.endDate} onChange={handleBlockFormChange} className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required />
            <input type="text" name="reason" value={blockForm.reason} onChange={handleBlockFormChange} placeholder="Motivo del bloqueo" className="rounded-xl border border-outline-variant/60 bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:col-span-2" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={isCreatingBlock} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-70">
                {isCreatingBlock ? 'Creando...' : 'Crear bloqueo'}
              </button>
            </div>
          </form>

          <div className="mt-6 space-y-3">
            {blocks.length ? (
              blocks.map((block) => (
                <div key={block.id} className="rounded-2xl border border-outline-variant/40 bg-surface-container px-4 py-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-on-surface">{block.reason || 'Bloqueo'}</p>
                      <p className="text-sm text-on-surface-variant">{formatDateTimeLocal(block.startDate)} → {formatDateTimeLocal(block.endDate)}</p>
                    </div>
                    <button onClick={() => handleDeleteBlock(block.id)} className="text-sm font-medium text-error hover:text-on-error-container">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-outline-variant/40 bg-surface-container px-4 py-5 text-sm text-on-surface-variant">
                No hay bloqueos programados.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
          <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Nota</p>
          <h3 className="mt-1 text-xl font-semibold text-on-surface">Disponibilidad real</h3>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Estos horarios alimentan el cálculo de slots disponibles del backend. Cuando cierres un día o crees un bloqueo, las citas nuevas ya no podrán cruzarse con ese rango.
          </p>
        </div>
      </section>
    </div>
  )
}
