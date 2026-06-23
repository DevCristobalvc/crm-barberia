// Tipos que reflejan exactamente los schemas del backend (api-barberia/app/schemas/)

export interface Shop {
  id: string;
  name: string;
  assistant_name: string;
  phone: string | null;
  address: string | null;
  timezone: string;
  prompt: string | null;
  created_at: string;
}

export interface Barber {
  id: string;
  shop_id: string;
  name: string;
  active: boolean;
  services: string[];
}

export interface Service {
  id: string;
  shop_id: string;
  name: string;
  duration: number; // minutes
  price: number;
  active: boolean;
}

export interface Customer {
  id: string;
  shop_id: string;
  name: string;
  phone: string;
  notes: string | null;
  visits: number;
  last_visit: string | null;
  created_at: string;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentSource = "whatsapp" | "dashboard" | "api";

export interface Appointment {
  id: string;
  shop_id: string;
  barber_id: string;
  customer_id: string;
  service_id: string;
  start_datetime: string;
  end_datetime: string;
  status: AppointmentStatus;
  source: AppointmentSource;
  notes: string | null;
  created_at: string;
}

export interface AppointmentWithDetails extends Appointment {
  // Joins que devuelve list_today
  customers?: { name: string; phone: string };
  barbers?: { name: string };
  services?: { name: string; duration: number; price: number };
  // Flatten para conveniencia
  customer_name?: string;
  customer_phone?: string;
  barber_name?: string;
  service_name?: string;
  service_duration?: number;
  service_price?: number;
}

export interface AppointmentCreate {
  shop_id: string;
  barber_id: string;
  customer_id: string;
  service_id: string;
  start_datetime: string;
  end_datetime: string;
  notes?: string;
  source?: AppointmentSource;
}

export interface AppointmentUpdate {
  barber_id?: string;
  start_datetime?: string;
  end_datetime?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface BarberSchedule {
  id: string;
  barber_id: string;
  weekday: number; // 0=Lunes
  start_time: string;
  end_time: string;
}

export interface DashboardStats {
  appointmentsToday: number;
  completed: number;
  pending: number;
  confirmed: number;
  revenue: number;
  newClients: number;
}
