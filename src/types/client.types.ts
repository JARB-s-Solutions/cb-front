export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  totalAppointments?: number;
  createdAt: string;
}

export interface CreateClientDTO {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}