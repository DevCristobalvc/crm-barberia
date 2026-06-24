import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/login", "/api/auth/login", "/api/auth/logout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth   = request.cookies.get("barberia_admin")?.value === "true";
  const isPublic = PUBLIC.some((p) => pathname.startsWith(p));

  if (!isPublic && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname === "/login" && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Excluir archivos estáticos, imágenes y _next de forma explícita
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.gif).*)",
  ],
};
