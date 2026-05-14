// src/types/service.types.ts

export interface Service {
  id: number
  barberId: string
  name: string
  price: number
  durationMin: number
  isActive: boolean
  category?: string
  description?: string
  imageUrl?: string
}

export interface CreateServiceDTO {
  name: string
  price: number
  durationMin: number
  category?: string
  description?: string
}

export interface UpdateServiceDTO {
  name?: string
  price?: number
  durationMin?: number
  category?: string
  description?: string
  isActive?: boolean
}
