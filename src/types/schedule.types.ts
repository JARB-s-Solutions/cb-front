// src/types/schedule.types.ts

export interface ScheduleConfig {
  id: number
  barberId: string
  dayOfWeek: number // 0=Domingo, 1=Lunes, ..., 6=Sábado
  startTime: string // HH:MM
  endTime: string // HH:MM
  breakStart?: string
  breakEnd?: string
  isWorkDay: boolean
}

export interface ScheduleBlock {
  id: number
  barberId: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  reason?: string
}

export interface UpdateScheduleDTO {
  dayOfWeek: number
  startTime: string
  endTime: string
  breakStart?: string
  breakEnd?: string
  isWorkDay: boolean
}

export interface CreateBlockDTO {
  startDate: string
  endDate: string
  reason?: string
}

export const DAYS_OF_WEEK = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]
