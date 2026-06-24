"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Image src="/icon-192.png" alt="BarberIA" width={36} height={36} className="rounded-xl" unoptimized />
          <span className="text-xl font-semibold tracking-tight">BarberIA</span>
        </div>

        {/* Card */}
        <div className="bg-[#161616] border border-[#383838] rounded-2xl p-6 shadow-2xl shadow-black/60">
          <h1 className="text-lg font-semibold mb-1 text-[#F5F5F5]">Panel de administración</h1>
          <p className="text-sm text-[#AAAAAA] mb-6">Ingresa con tus credenciales.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-[#CCCCCC] font-medium">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="barbero@test.com"
                required
                className="bg-[#222222] border border-[#404040] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] placeholder:text-[#555555] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm text-[#CCCCCC] font-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#222222] border border-[#404040] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] placeholder:text-[#555555] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-300 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2.5 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-[#0A0A0A] font-bold rounded-lg text-sm hover:bg-gold-light transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-5 pt-4 border-t border-[#2A2A2A]">
            <p className="text-xs text-[#666666] text-center">
              Demo: <span className="text-[#AAAAAA]">barbero@test.com</span> · <span className="text-[#AAAAAA]">123</span>
            </p>
          </div>
        </div>

        <Link
          href="https://site-barberia.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-sm text-[#555555] hover:text-[#888888] transition-colors mt-5"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
