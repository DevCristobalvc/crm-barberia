import type {
  Shop,
  Barber,
  Service,
  Customer,
  Appointment,
  AppointmentWithDetails,
  AppointmentCreate,
  AppointmentUpdate,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Appointments ────────────────────────────────────────────────────────────

export const appointmentsApi = {
  listToday: (shopId: string) =>
    request<AppointmentWithDetails[]>(`/api/v1/appointments/${shopId}/today`),

  list: (shopId: string, dateFrom?: string, dateTo?: string) => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    const qs = params.toString();
    return request<Appointment[]>(
      `/api/v1/appointments/${shopId}${qs ? `?${qs}` : ""}`
    );
  },

  create: (data: AppointmentCreate) =>
    request<Appointment>("/api/v1/appointments/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: AppointmentUpdate) =>
    request<Appointment>(`/api/v1/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  cancel: (id: string) =>
    request<Appointment>(`/api/v1/appointments/${id}`, { method: "DELETE" }),
};

// ─── Clients ─────────────────────────────────────────────────────────────────

export const clientsApi = {
  list: (shopId: string, query?: string) => {
    const qs = query ? `?q=${encodeURIComponent(query)}` : "";
    return request<Customer[]>(`/api/v1/clients/${shopId}${qs}`);
  },

  get: (shopId: string, customerId: string) =>
    request<Customer>(`/api/v1/clients/${shopId}/${customerId}`),

  create: (data: { shop_id: string; name: string; phone: string; notes?: string }) =>
    request<Customer>("/api/v1/clients/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { name?: string; notes?: string }) =>
    request<Customer>(`/api/v1/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ─── Barbers ─────────────────────────────────────────────────────────────────

export const barbersApi = {
  list: (shopId: string, activeOnly = true) =>
    request<Barber[]>(
      `/api/v1/barbers/${shopId}${!activeOnly ? "?active_only=false" : ""}`
    ),

  getSchedule: (barberId: string) =>
    request<{ id: string; barber_id: string; weekday: number; start_time: string; end_time: string }[]>(
      `/api/v1/barbers/${barberId}/schedule`
    ),

  create: (data: { shop_id: string; name: string }) =>
    request<Barber>("/api/v1/barbers/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { name?: string; active?: boolean }) =>
    request<Barber>(`/api/v1/barbers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ─── Services ────────────────────────────────────────────────────────────────

export const servicesApi = {
  list: (shopId: string) =>
    request<Service[]>(`/api/v1/services/${shopId}`),

  create: (data: { shop_id: string; name: string; duration: number; price: number }) =>
    request<Service>("/api/v1/services/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { name?: string; duration?: number; price?: number }) =>
    request<Service>(`/api/v1/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<{ success: boolean }>(`/api/v1/services/${id}`, { method: "DELETE" }),
};

// ─── Shop ─────────────────────────────────────────────────────────────────────

export const shopApi = {
  get: (shopId: string) =>
    request<Shop>(`/api/v1/shops/${shopId}`),

  update: (shopId: string, data: Partial<Shop>) =>
    request<Shop>(`/api/v1/shops/${shopId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ─── Health ──────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => request<{ status: string; service: string }>("/health"),
};
