"use client";

import { clientsApi } from "@/lib/api";
import { SHOP_ID } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Search, Phone, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients", SHOP_ID, debouncedQuery],
    queryFn: () => clientsApi.list(SHOP_ID, debouncedQuery || undefined),
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Clientes</h1>
          <p className="text-sm text-[#888888] mt-0.5">
            {isLoading ? "Cargando..." : `${clients.length} cliente${clients.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
        {isLoading && debouncedQuery && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555] animate-spin" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, teléfono o notas..."
          className="w-full bg-[#111111] border border-[#2A2A2A] rounded-xl pl-9 pr-10 py-2.5 text-sm text-[#F5F5F5] placeholder:text-[#444444] focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_2fr] px-5 py-3 border-b border-[#1A1A1A] text-xs text-[#555555] font-medium uppercase tracking-wide">
          <span>Cliente</span>
          <span>Teléfono</span>
          <span>Visitas</span>
          <span>Última visita</span>
          <span>Notas</span>
        </div>

        {error ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-400">Error al cargar clientes</p>
            <p className="text-xs text-[#555555] mt-1">Verifica que el backend esté corriendo</p>
          </div>
        ) : isLoading && !debouncedQuery ? (
          <div className="py-12 text-center text-sm text-[#555555]">Cargando clientes...</div>
        ) : clients.length === 0 ? (
          <p className="text-center text-sm text-[#555555] py-10">
            {query ? "No se encontraron clientes" : "Sin clientes registrados aún"}
          </p>
        ) : (
          <div className="divide-y divide-[#1A1A1A]">
            {clients.map((client) => (
              <div key={client.id} className="px-5 py-3.5 hover:bg-[#1A1A0A]/40 transition-colors cursor-pointer">
                {/* Mobile */}
                <div className="md:hidden flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-sm font-medium text-gold flex-shrink-0">
                    {client.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-xs text-[#888888] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {client.phone}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gold">{client.visits} visitas</span>
                      {client.last_visit && (
                        <span className="text-xs text-[#555555] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {client.last_visit.slice(0, 10)}
                        </span>
                      )}
                    </div>
                    {client.notes && (
                      <p className="text-xs text-[#555555] mt-1 italic">{client.notes}</p>
                    )}
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_2fr] items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xs font-medium text-gold">
                      {client.name[0]}
                    </div>
                    <span className="text-sm font-medium">{client.name}</span>
                  </div>
                  <span className="text-sm text-[#888888]">{client.phone}</span>
                  <span className="text-sm text-gold font-medium">{client.visits}</span>
                  <span className="text-sm text-[#888888]">
                    {client.last_visit ? client.last_visit.slice(0, 10) : "—"}
                  </span>
                  <span className="text-sm text-[#555555] italic truncate">
                    {client.notes || "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
