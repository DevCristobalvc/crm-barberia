import type { Metadata } from "next";
import { Saira_Condensed } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const saira = Saira_Condensed({ variable: "--font-saira", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "BarberIA CRM",
  description: "Panel de administración — BarberIA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${saira.variable} antialiased bg-[#0A0A0A] text-[#F5F5F5]`} style={{ fontFamily: "var(--font-saira), sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
