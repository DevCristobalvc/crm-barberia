import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "barbero@test.com" && password === "123") {
    const response = NextResponse.json({ success: true });
    response.cookies.set("barberia_admin", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.json(
    { error: "Credenciales incorrectas" },
    { status: 401 }
  );
}
