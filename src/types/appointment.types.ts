// src/types/appointment.types.ts

export interface Service {
  id: number
  name: string
  price: number
  durationMin: number
  isActive: boolean
  category?: string
}

export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  internalNotes?: string
}

export interface Appointment {
  id: string
  barberId: string
  clientId: string
  serviceId: number
  date: string // ISO 8601
  frozenPrice: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes?: string
  reminderSent: boolean
  createdAt: string
  client?: Client
  service?: Service
}

export interface CreateAppointmentDTO {
  clientId: string
  serviceId: number
  date: string
  notes?: string
}

export interface UpdateAppointmentDTO {
  date?: string
  notes?: string
  status?: string
}
