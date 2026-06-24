"use client";

import { appointmentsApi, barbersApi, clientsApi, servicesApi } from "@/lib/api";
import { SHOP_ID } from "@/lib/constants";
import { FormModal } from "@/components/ui/form-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { AppointmentWithDetails } from "@/lib/types";
import { Plus, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

const STATUS_COLOR: Record<string, string> = {
  confirmed: "#10b981",
  pending:   "#D4AF37",
  completed: "#6b7280",
  cancelled: "#ef4444",
  no_show:   "#f97316",
};

function appointmentToEvent(a: AppointmentWithDetails) {
  const clientName  = a.customers?.name  ?? a.customer_name  ?? "Cliente";
  const serviceName = a.services?.name   ?? a.service_name   ?? "";
  const color       = STATUS_COLOR[a.status] ?? "#D4AF37";
  return {
    id: a.id,
    title: `${clientName.split(" ")[0]} — ${serviceName}`,
    start: a.start_datetime,
    end:   a.end_datetime,
    backgroundColor: color,
    borderColor:     color,
    textColor: a.status === "pending" ? "#0A0A0A" : "#fff",
    extendedProps: { status: a.status, barber: a.barbers?.name ?? a.barber_name },
  };
}

function getDateRange() {
  const now = new Date();
  const from = new Date(now); from.setDate(from.getDate() - 7);
  const to   = new Date(now); to.setDate(to.getDate() + 21);
  return { date_from: from.toISOString(), date_to: to.toISOString() };
}

export default function CalendarPage() {
  const qc = useQueryClient();
  const { date_from, date_to } = useMemo(() => getDateRange(), []);
  const [showModal, setShowModal] = useState(false);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments", SHOP_ID, date_from, date_to],
    queryFn: () => appointmentsApi.list(SHOP_ID, date_from, date_to),
    staleTime: 60_000,
  });

  const { data: barbers = [] } = useQuery({
    queryKey: ["barbers", SHOP_ID],
    queryFn: () => barbersApi.list(SHOP_ID),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients", SHOP_ID],
    queryFn: () => clientsApi.list(SHOP_ID),
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services", SHOP_ID],
    queryFn: () => servicesApi.list(SHOP_ID),
  });

  const createAppt = useMutation({
    mutationFn: async (values: Record<string, string>) => {
      const service = services.find((s) => s.id === values.service_id);
      if (!service) throw new Error("Selecciona un servicio válido");
      const start = new Date(`${values.date}T${values.time}:00`);
      const end   = new Date(start.getTime() + service.duration * 60000);

      return appointmentsApi.create({
        shop_id:        SHOP_ID,
        barber_id:      values.barber_id,
        customer_id:    values.customer_id,
        service_id:     values.service_id,
        start_datetime: start.toISOString(),
        end_datetime:   end.toISOString(),
        source:         "dashboard",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      setShowModal(false);
    },
  });

  const events = useMemo(() => appointments.map(appointmentToEvent), [appointments]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Calendario</h1>
          <p className="text-sm text-[#888888] mt-0.5">Vista de citas por día y semana</p>
        </div>
        <div className="flex items-center gap-3">
          {isLoading && <Loader2 className="w-4 h-4 text-[#888888] animate-spin" />}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-gold-light transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            Nueva cita
          </button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {Object.entries(STATUS_COLOR).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-[#888888]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {{ confirmed: "Confirmada", pending: "Pendiente", completed: "Completada", cancelled: "Cancelada", no_show: "No asistió" }[status]}
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden p-4 calendar-wrapper">
        <style>{`
          .calendar-wrapper .fc { --fc-border-color: #2A2A2A; --fc-button-bg-color: #1A1A1A; --fc-button-border-color: #2A2A2A; --fc-button-text-color: #F5F5F5; --fc-button-hover-bg-color: #2A2A2A; --fc-button-hover-border-color: #3A3A3A; --fc-button-active-bg-color: #D4AF37; --fc-button-active-border-color: #D4AF37; --fc-today-bg-color: rgba(212,175,55,0.05); --fc-page-bg-color: transparent; font-size: 13px; }
          .calendar-wrapper .fc-toolbar-title { font-size: 1rem; font-weight: 600; color: #F5F5F5; }
          .calendar-wrapper .fc-col-header-cell-cushion, .calendar-wrapper .fc-daygrid-day-number, .calendar-wrapper .fc-timegrid-slot-label { color: #888888; }
          .calendar-wrapper .fc-button { border-radius: 8px !important; font-size: 12px !important; padding: 4px 10px !important; }
          .calendar-wrapper .fc-button-active { color: #0A0A0A !important; }
          .calendar-wrapper .fc-event { border-radius: 6px; font-size: 11px; font-weight: 500; }
          .calendar-wrapper .fc-scrollgrid { border-color: #2A2A2A !important; }
          .calendar-wrapper .fc-timegrid-axis { color: #555555; }
        `}</style>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
          events={events}
          locale="es"
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          allDaySlot={false}
          height="auto"
          slotDuration="00:30:00"
          nowIndicator={true}
          editable={true}
          selectable={true}
          dateClick={(info) => {
            // Al hacer clic en un slot, abre el modal
            setShowModal(true);
          }}
          dayMaxEvents={3}
          buttonText={{ today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
          eventDidMount={(info) => {
            const barber = info.event.extendedProps.barber;
            if (barber) info.el.setAttribute("title", `Barbero: ${barber}`);
          }}
        />
      </div>

      {/* Modal crear cita */}
      <FormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva cita"
        submitLabel="Crear cita"
        fields={[
          {
            key: "customer_id", label: "Cliente", type: "select", required: true,
            options: clients.map((c) => ({ value: c.id, label: `${c.name} · ${c.phone}` })),
          },
          {
            key: "barber_id", label: "Barbero", type: "select", required: true,
            options: barbers.map((b) => ({ value: b.id, label: b.name })),
          },
          {
            key: "service_id", label: "Servicio", type: "select", required: true,
            options: services.map((s) => ({ value: s.id, label: `${s.name} (${s.duration}min)` })),
          },
          { key: "date", label: "Fecha",  type: "text", placeholder: "2025-06-24", required: true },
          { key: "time", label: "Hora",   type: "time", required: true },
        ]}
        onSubmit={async (v) => { await createAppt.mutateAsync(v); }}
      />
    </div>
  );
}
