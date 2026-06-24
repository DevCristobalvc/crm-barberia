"use client";

import {
  Calendar, LayoutDashboard, LogOut, Scissors,
  Settings, Users, Menu, X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",     icon: LayoutDashboard },
  { href: "/calendar",   label: "Calendario",    icon: Calendar },
  { href: "/clients",    label: "Clientes",      icon: Users },
  { href: "/barbers",    label: "Barberos",      icon: Scissors },
  { href: "/settings",   label: "Configuración", icon: Settings },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-[#0D0D0D] border-r border-[#1A1A1A] flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-[#1A1A1A]">
          <Image src="/icon-192.png" alt="BarberIA" width={28} height={28} className="rounded-lg" />
          <span className="font-semibold text-sm tracking-tight">BarberIA CRM</span>
          <button onClick={() => setOpen(false)} className="ml-auto lg:hidden text-[#888888]"><X className="w-4 h-4" /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${active ? "bg-gold/10 text-gold border border-gold/20" : "text-[#888888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]"}`}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
            <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-xs font-medium text-gold">B</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">barbero@test.com</p>
              <p className="text-xs text-[#555555]">Administrador</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[#888888] hover:text-red-400 hover:bg-red-900/10 transition-all">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="lg:hidden h-14 border-b border-[#1A1A1A] flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => setOpen(true)} className="text-[#888888] hover:text-[#F5F5F5]"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-2">
            <Image src="/icon-192.png" alt="BarberIA" width={24} height={24} className="rounded-md" />
            <span className="text-sm font-semibold">BarberIA CRM</span>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
