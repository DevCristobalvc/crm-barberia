"use client";

import { appointmentsApi } from "@/lib/api";
import { SHOP_ID } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { AppointmentWithDetails, AppointmentStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, CheckCircle, Clock, TrendingUp, Users, RefreshCw } from "lucide-react";

const STATUS: Record<AppointmentStatus, { label: string; color: string }> = {
  confirmed: { label: "Confirmada", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  completed: { label: "Completada", color: "text-[#888888] bg-[#1A1A1A] border-[#2A2A2A]" },
  pending:   { label: "Pendiente",  color: "text-gold bg-gold/10 border-gold/20" },
  cancelled: { label: "Cancelada",  color: "text-red-400 bg-red-900/10 border-red-900/20" },
  no_show:   { label: "No asistió", color: "text-orange-400 bg-orange-900/10 border-orange-900/20" },
};

function flattenAppointment(a: AppointmentWithDetails) {
  return {
    ...a,
    client:  a.customers?.name  ?? a.customer_name ?? "—",
    barber:  a.barbers?.name    ?? a.barber_name   ?? "—",
    service: a.services?.name   ?? a.service_name  ?? "—",
    price:   a.services?.price  ?? a.service_price ?? 0,
    duration: a.services?.duration ?? a.service_duration ?? 0,
    time: new Date(a.start_datetime).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}

export default function DashboardPage() {
  const { data: appointments = [], isLoading, error, refetch } = useQuery({
    queryKey: ["appointments", "today", SHOP_ID],
    queryFn: () => appointmentsApi.listToday(SHOP_ID),
    refetchInterval: 60_000, // refresca cada minuto
  });

  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const active = appointments.filter((a) => a.status !== "cancelled");
  const completed = active.filter((a) => a.status === "completed").length;
  const pending   = active.filter((a) => a.status === "pending").length;
  const confirmed = active.filter((a) => a.status === "confirmed").length;
  const revenue   = active
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + (a.services?.price ?? a.service_price ?? 0), 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-[#888888] capitalize mt-0.5">{today}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-lg hover:bg-[#1A1A1A] text-[#888888] hover:text-[#F5F5F5] transition-colors"
          title="Actualizar"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Citas hoy",      value: active.length,             icon: <Calendar   className="w-4 h-4 text-gold" />, sub: `${completed} completadas` },
          { label: "Pendientes",     value: pending + confirmed,        icon: <Clock      className="w-4 h-4 text-gold" />, sub: "por atender" },
          { label: "Completadas",    value: completed,                  icon: <Users      className="w-4 h-4 text-gold" />, sub: "hoy" },
          { label: "Ingresos hoy",   value: formatCurrency(revenue),    icon: <TrendingUp className="w-4 h-4 text-gold" />, sub: `de ${completed} citas` },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#888888]">{stat.label}</p>
              <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-[#555555] mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Appointments table */}
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
          <h2 className="text-sm font-semibold">Citas de hoy</h2>
          <span className="text-xs text-[#888888]">{active.length} citas</span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-[#555555]">Cargando citas...</div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-400">Error al cargar citas</p>
            <p className="text-xs text-[#555555] mt-1">Verifica que el backend esté corriendo en localhost:8000</p>
          </div>
        ) : active.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#555555]">Sin citas programadas para hoy</div>
        ) : (
          <div className="divide-y divide-[#1A1A1A]">
            {active.map((appt) => {
              const flat = flattenAppointment(appt);
              const status = STATUS[appt.status];
              return (
                <div key={appt.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#1A1A0A]/40 transition-colors">
                  <div className="w-12 flex-shrink-0">
                    <p className="text-sm font-mono font-medium text-gold">{flat.time}</p>
                    <p className="text-xs text-[#555555]">{flat.duration}min</p>
                  </div>
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-xs font-medium text-[#888888] flex-shrink-0">
                      {flat.client[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{flat.client}</p>
                      <p className="text-xs text-[#888888] truncate">{flat.service}</p>
                    </div>
                  </div>
                  <p className="hidden md:block text-xs text-[#888888] flex-shrink-0">{flat.barber.split(" ")[0]}</p>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mini stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {[
          { label: "Confirmadas", count: confirmed, color: "text-emerald-400" },
          { label: "Completadas", count: completed, color: "text-[#888888]" },
          { label: "Pendientes",  count: pending,   color: "text-gold" },
        ].map((s, i) => (
          <div key={i} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 text-center">
            <CheckCircle className={`w-4 h-4 ${s.color} mx-auto mb-2`} />
            <p className={`text-xl font-semibold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-[#555555] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
