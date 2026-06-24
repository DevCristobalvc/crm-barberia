"use client";

import { cn } from "@/lib/utils";
import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export interface FormField {
  key: string;
  label: string;
  type: "text" | "number" | "email" | "tel" | "time" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  min?: number;
  options?: { value: string; label: string }[];
}

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  submitLabel?: string;
}

export function FormModal({ open, onClose, title, fields, onSubmit, submitLabel = "Guardar" }: FormModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setValues({});
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const set = (key: string, val: string) => setValues((v) => ({ ...v, [key]: val }));

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1A1A1A] text-[#888888] hover:text-[#F5F5F5] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handle} className="px-6 py-5 space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888888] font-medium">
                {field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}
              </label>

              {field.type === "select" ? (
                <select
                  value={values[field.key] ?? ""}
                  onChange={(e) => set(field.key, e.target.value)}
                  required={field.required}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] focus:outline-none focus:border-gold/40 transition-colors"
                >
                  <option value="">Seleccionar...</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={values[field.key] ?? ""}
                  onChange={(e) => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] placeholder:text-[#444444] focus:outline-none focus:border-gold/40 transition-colors resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  value={values[field.key] ?? ""}
                  onChange={(e) => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  min={field.min}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-base text-[#F5F5F5] placeholder:text-[#444444] focus:outline-none focus:border-gold/40 transition-colors"
                />
              )}
            </div>
          ))}

          {error && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-900/30 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-[#2A2A2A] text-[#888888] text-sm rounded-lg hover:bg-[#1A1A1A] transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-gold text-[#0A0A0A] text-sm font-semibold rounded-lg hover:bg-gold-light transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Guardando..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
