"use client";

import { shopApi, servicesApi } from "@/lib/api";
import { SHOP_ID } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Tab = "general" | "assistant" | "services" | "schedule";
const TABS: { id: Tab; label: string }[] = [
  { id: "general",   label: "General" },
  { id: "assistant", label: "Asistente IA" },
  { id: "services",  label: "Servicios" },
  { id: "schedule",  label: "Horarios" },
];
const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

export default function SettingsPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);

  // Shop data
  const { data: shop, isLoading: shopLoading } = useQuery({
    queryKey: ["shop", SHOP_ID],
    queryFn: () => shopApi.get(SHOP_ID),
  });

  // Services data
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["services", SHOP_ID],
    queryFn: () => servicesApi.list(SHOP_ID),
  });

  // Local form state (synced from shop)
  const [form, setForm] = useState({
    name: "",
    assistant_name: "",
    phone: "",
    address: "",
    timezone: "America/Bogota",
    prompt: "",
  });

  useEffect(() => {
    if (shop) {
      setForm({
        name:           shop.name           ?? "",
        assistant_name: shop.assistant_name ?? "SofIA",
        phone:          shop.phone          ?? "",
        address:        shop.address        ?? "",
        timezone:       shop.timezone       ?? "America/Bogota",
        prompt:         shop.prompt         ?? "",
      });
    }
  }, [shop]);

  const updateShop = useMutation({
    mutationFn: () => shopApi.update(SHOP_ID, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shop", SHOP_ID] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => servicesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services", SHOP_ID] }),
  });

  const isLoading = shopLoading || servicesLoading;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Configuración</h1>
          <p className="text-sm text-[#888888] mt-0.5">Personaliza tu barbería y asistente</p>
        </div>
        <button
          onClick={() => updateShop.mutate()}
          disabled={updateShop.isPending || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-gold-light transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {updateShop.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? "¡Guardado!" : "Guardar"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#111111] border border-[#2A2A2A] rounded-xl p-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 text-sm rounded-lg transition-all font-medium ${
              activeTab === tab.id
                ? "bg-gold text-[#0A0A0A]"
                : "text-[#888888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === "general" && (
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold pb-3 border-b border-[#1A1A1A]">Información del negocio</h2>
          {shopLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 text-gold animate-spin" /></div>
          ) : (
            [
              { label: "Nombre del negocio", key: "name" as const },
              { label: "Teléfono",           key: "phone" as const },
              { label: "Dirección",          key: "address" as const },
              { label: "Zona horaria",       key: "timezone" as const },
            ].map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888888] font-medium">{field.label}</label>
                <input
                  value={form[field.key]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* Assistant */}
      {activeTab === "assistant" && (
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold pb-3 border-b border-[#1A1A1A]">Asistente virtual</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#888888] font-medium">Nombre del asistente</label>
            <input
              value={form.assistant_name}
              onChange={(e) => setForm((f) => ({ ...f, assistant_name: e.target.value }))}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#888888] font-medium">Prompt del sistema</label>
            <p className="text-xs text-[#555555]">
              Define la personalidad y comportamiento del asistente.
            </p>
            <textarea
              value={form.prompt}
              onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
              rows={6}
              placeholder="Eres SofIA, la asistente de la barbería. Eres amigable, profesional y concisa..."
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] focus:outline-none focus:border-gold/40 transition-colors resize-none font-mono"
            />
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-lg px-4 py-3">
            <p className="text-xs text-gold font-medium mb-1">Preview del saludo</p>
            <p className="text-sm text-[#F5F5F5]">
              &ldquo;Hola 👋 Soy {form.assistant_name || "SofIA"}, la asistente de {form.name || "la barbería"}. ¿En qué te puedo ayudar?&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Services */}
      {activeTab === "services" && (
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
            <h2 className="text-sm font-semibold">Servicios</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/30 text-gold text-xs rounded-lg hover:bg-gold/10 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Agregar
            </button>
          </div>
          {servicesLoading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 text-gold animate-spin" /></div>
          ) : (
            <div className="divide-y divide-[#1A1A1A]">
              {services.map((service) => (
                <div key={service.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-[#888888] mt-0.5">{service.duration} minutos</p>
                  </div>
                  <p className="text-sm font-semibold text-gold">{formatCurrency(service.price)}</p>
                  <button
                    onClick={() => deleteService.mutate(service.id)}
                    className="p-1.5 rounded-lg hover:bg-red-900/10 text-[#888888] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule */}
      {activeTab === "schedule" && (
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1A1A1A]">
            <h2 className="text-sm font-semibold">Horario de atención</h2>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {DAYS.map((day, i) => {
              const isOpen = i < 6;
              return (
                <div key={day} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="w-24 flex-shrink-0">
                    <p className="text-sm font-medium">{day}</p>
                  </div>
                  {isOpen ? (
                    <div className="flex items-center gap-3">
                      <input defaultValue="09:00" type="time" className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-sm text-[#F5F5F5] focus:outline-none focus:border-gold/40" />
                      <span className="text-[#555555] text-sm">—</span>
                      <input defaultValue="20:00" type="time" className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-sm text-[#F5F5F5] focus:outline-none focus:border-gold/40" />
                    </div>
                  ) : (
                    <span className="text-sm text-[#555555]">Cerrado</span>
                  )}
                  <div className="ml-auto">
                    <button className={`w-10 h-5 rounded-full transition-all relative ${isOpen ? "bg-gold" : "bg-[#2A2A2A]"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isOpen ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
