"use client";

import { barbersApi } from "@/lib/api";
import { SHOP_ID } from "@/lib/constants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Scissors, Calendar, BarChart3, Loader2 } from "lucide-react";
import { useState } from "react";

export default function BarbersPage() {
  const qc = useQueryClient();
  const [activeBarber, setActiveBarber] = useState<string | null>(null);

  const { data: barbers = [], isLoading, error } = useQuery({
    queryKey: ["barbers", SHOP_ID],
    queryFn: () => barbersApi.list(SHOP_ID, false), // incluye inactivos
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      barbersApi.update(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barbers", SHOP_ID] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  const active = barbers.filter((b) => b.active);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Barberos</h1>
          <p className="text-sm text-[#888888] mt-0.5">{active.length} activos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-gold-light transition-all active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-sm text-red-400">Error al cargar barberos</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className={`bg-[#111111] border rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                activeBarber === barber.id
                  ? "border-gold/40 bg-[#111108]"
                  : "border-[#2A2A2A] hover:border-gold/20"
              }`}
              onClick={() =>
                setActiveBarber(activeBarber === barber.id ? null : barber.id)
              }
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-sm font-semibold text-gold">
                    {barber.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{barber.name}</p>
                    <p className="text-xs text-[#888888]">Barbero</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    barber.active
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : "text-[#888888] bg-[#1A1A1A] border-[#2A2A2A]"
                  }`}
                >
                  {barber.active ? "Activo" : "Inactivo"}
                </span>
              </div>

              {barber.services && barber.services.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#555555] mb-2 flex items-center gap-1.5">
                    <Scissors className="w-3 h-3" /> Servicios
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {barber.services.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-xs text-[#888888]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1A1A1A]">
                <div>
                  <p className="text-xs text-[#555555] flex items-center gap-1 mb-0.5">
                    <Calendar className="w-3 h-3" /> Horario
                  </p>
                  <p className="text-sm text-[#888888]">Lun – Sáb</p>
                </div>
                <div>
                  <p className="text-xs text-[#555555] flex items-center gap-1 mb-0.5">
                    <BarChart3 className="w-3 h-3" /> Estado
                  </p>
                  <p className={`text-sm font-medium ${barber.active ? "text-emerald-400" : "text-[#888888]"}`}>
                    {barber.active ? "Disponible" : "Inactivo"}
                  </p>
                </div>
              </div>

              {activeBarber === barber.id && (
                <div className="mt-4 pt-3 border-t border-[#1A1A1A] flex gap-2">
                  <button className="flex-1 py-1.5 text-xs border border-gold/30 text-gold rounded-lg hover:bg-gold/10 transition-colors">
                    Editar
                  </button>
                  <button className="flex-1 py-1.5 text-xs border border-[#2A2A2A] text-[#888888] rounded-lg hover:bg-[#1A1A1A] transition-colors">
                    Horarios
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActive.mutate({ id: barber.id, active: !barber.active });
                    }}
                    className={`flex-1 py-1.5 text-xs border rounded-lg transition-colors ${
                      barber.active
                        ? "border-red-900/30 text-red-400 hover:bg-red-900/10"
                        : "border-emerald-900/30 text-emerald-400 hover:bg-emerald-900/10"
                    }`}
                  >
                    {toggleActive.isPending ? "..." : barber.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
