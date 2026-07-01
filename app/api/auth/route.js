import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 2, // 2 hours
      });

      return NextResponse.json({ success: true, message: "Logged in successfully" });
    }

    return NextResponse.json(
      { success: false, message: "Incorrect password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (session && session.value === "authenticated") {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
