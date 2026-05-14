// src/types/dashboard.types.ts

export interface MetricData {
  todayIncome: number
  incomeChange: number // porcentaje
  completedAppointments: number
  avgRating: number
  newClientsWeek: number
}

export interface IncomeChartData {
  labels: string[]
  cash: number[]
  transfer: number[]
}

export interface AppointmentSummary {
  id: string
  time: string
  clientName: string
  service: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  reminderSent: boolean
}

export interface SubscriptionInfo {
  type: 'FREE' | 'PREMIUM'
  appointmentsUsed: number
  appointmentsLimit: number
  expiresAt: string
}

export interface DashboardData {
  metrics: MetricData
  incomeChart: IncomeChartData
  todayAppointments: AppointmentSummary[]
  subscription: SubscriptionInfo
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
