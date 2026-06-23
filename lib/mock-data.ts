export const shop = {
  id: "shop_1",
  name: "BarberIA Demo",
  assistantName: "SofIA",
  phone: "+57 300 123 4567",
  address: "Calle 93 #15-32, Bogotá",
  timezone: "America/Bogota",
  hours: "Lunes – Sábado, 9:00 AM – 8:00 PM",
};

export const barbers = [
  {
    id: "b1",
    name: "Carlos Mendoza",
    services: ["Corte Clásico", "Fade Americano", "Corte + Barba"],
    schedule: "Lun – Sáb",
    active: true,
    appointments: 127,
  },
  {
    id: "b2",
    name: "Miguel Torres",
    services: ["Corte Clásico", "Afeitado Clásico"],
    schedule: "Lun – Vie",
    active: true,
    appointments: 98,
  },
  {
    id: "b3",
    name: "Roberto Silva",
    services: ["Fade Americano", "Diseño de Barba", "Corte + Barba"],
    schedule: "Mar – Sáb",
    active: true,
    appointments: 114,
  },
];

export const services = [
  { id: "s1", name: "Corte Clásico", duration: 30, price: 15000 },
  { id: "s2", name: "Fade Americano", duration: 45, price: 20000 },
  { id: "s3", name: "Corte + Barba", duration: 60, price: 28000 },
  { id: "s4", name: "Afeitado Clásico", duration: 30, price: 12000 },
  { id: "s5", name: "Diseño de Barba", duration: 20, price: 10000 },
];

export const clients = [
  { id: "c1", name: "Juan García", phone: "+57 311 234 5678", visits: 12, lastVisit: "2025-06-15", notes: "Prefiere a Carlos. Fade bajo." },
  { id: "c2", name: "Pedro Martínez", phone: "+57 312 345 6789", visits: 5, lastVisit: "2025-06-10", notes: "" },
  { id: "c3", name: "Luis Rodríguez", phone: "+57 313 456 7890", visits: 23, lastVisit: "2025-06-18", notes: "Cliente frecuente. Corte + barba siempre." },
  { id: "c4", name: "Andrés López", phone: "+57 314 567 8901", visits: 8, lastVisit: "2025-06-05", notes: "" },
  { id: "c5", name: "Felipe Castro", phone: "+57 315 678 9012", visits: 3, lastVisit: "2025-05-28", notes: "Primer servicio fue afeitado." },
  { id: "c6", name: "Sebastián García", phone: "+57 316 789 0123", visits: 17, lastVisit: "2025-06-20", notes: "Prefiere tarde." },
  { id: "c7", name: "Diego Mora", phone: "+57 317 890 1234", visits: 9, lastVisit: "2025-06-12", notes: "" },
  { id: "c8", name: "Camilo Vargas", phone: "+57 318 901 2345", visits: 31, lastVisit: "2025-06-22", notes: "VIP. Siempre con Roberto." },
];

export const todayAppointments = [
  { id: "a1", time: "09:00", client: "Juan García", service: "Corte Clásico", barber: "Carlos Mendoza", duration: 30, status: "confirmed" },
  { id: "a2", time: "10:00", client: "Pedro Martínez", service: "Fade Americano", barber: "Miguel Torres", duration: 45, status: "confirmed" },
  { id: "a3", time: "11:00", client: "Luis Rodríguez", service: "Corte + Barba", barber: "Roberto Silva", duration: 60, status: "completed" },
  { id: "a4", time: "12:00", client: "Andrés López", service: "Corte Clásico", barber: "Carlos Mendoza", duration: 30, status: "confirmed" },
  { id: "a5", time: "14:00", client: "Felipe Castro", service: "Afeitado Clásico", barber: "Miguel Torres", duration: 30, status: "pending" },
  { id: "a6", time: "15:30", client: "Sebastián García", service: "Fade Americano", barber: "Carlos Mendoza", duration: 45, status: "pending" },
  { id: "a7", time: "16:00", client: "Diego Mora", service: "Corte + Barba", barber: "Roberto Silva", duration: 60, status: "pending" },
  { id: "a8", time: "17:30", client: "Camilo Vargas", service: "Diseño de Barba", barber: "Roberto Silva", duration: 20, status: "pending" },
];

export const calendarEvents = [
  // Today
  { id: "1", title: "Juan G. — Corte", start: "2025-06-23T09:00:00", end: "2025-06-23T09:30:00", backgroundColor: "#D4AF37", borderColor: "#D4AF37", textColor: "#0A0A0A" },
  { id: "2", title: "Pedro M. — Fade", start: "2025-06-23T10:00:00", end: "2025-06-23T10:45:00", backgroundColor: "#D4AF37", borderColor: "#D4AF37", textColor: "#0A0A0A" },
  { id: "3", title: "Luis R. — Corte+Barba", start: "2025-06-23T11:00:00", end: "2025-06-23T12:00:00", backgroundColor: "#888", borderColor: "#888", textColor: "#fff" },
  { id: "4", title: "Andrés L. — Corte", start: "2025-06-23T12:00:00", end: "2025-06-23T12:30:00", backgroundColor: "#D4AF37", borderColor: "#D4AF37", textColor: "#0A0A0A" },
  { id: "5", title: "Felipe C. — Afeitado", start: "2025-06-23T14:00:00", end: "2025-06-23T14:30:00", backgroundColor: "#D4AF37", borderColor: "#D4AF37", textColor: "#0A0A0A" },
  { id: "6", title: "Sebastián G. — Fade", start: "2025-06-23T15:30:00", end: "2025-06-23T16:15:00", backgroundColor: "#D4AF37", borderColor: "#D4AF37", textColor: "#0A0A0A" },
  { id: "7", title: "Diego M. — Corte+Barba", start: "2025-06-23T16:00:00", end: "2025-06-23T17:00:00", backgroundColor: "#D4AF37", borderColor: "#D4AF37", textColor: "#0A0A0A" },
  { id: "8", title: "Camilo V. — Diseño", start: "2025-06-23T17:30:00", end: "2025-06-23T17:50:00", backgroundColor: "#D4AF37", borderColor: "#D4AF37", textColor: "#0A0A0A" },
  // Yesterday
  { id: "9", title: "Andres R. — Corte", start: "2025-06-22T10:00:00", end: "2025-06-22T10:30:00", backgroundColor: "#888", borderColor: "#888", textColor: "#fff" },
  { id: "10", title: "Carlos B. — Fade", start: "2025-06-22T11:00:00", end: "2025-06-22T11:45:00", backgroundColor: "#888", borderColor: "#888", textColor: "#fff" },
  // Tomorrow
  { id: "11", title: "Mario P. — Corte", start: "2025-06-24T09:30:00", end: "2025-06-24T10:00:00", backgroundColor: "#D4AF37", borderColor: "#D4AF37", textColor: "#0A0A0A" },
  { id: "12", title: "José N. — Fade+Barba", start: "2025-06-24T11:00:00", end: "2025-06-24T12:00:00", backgroundColor: "#D4AF37", borderColor: "#D4AF37", textColor: "#0A0A0A" },
];

export const dashboardStats = {
  appointmentsToday: 8,
  completed: 3,
  pending: 5,
  newClients: 2,
  revenue: 164000,
  occupancy: 78,
};
