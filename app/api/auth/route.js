import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const adminFilePath = path.join(process.cwd(), "data", "admin.json");

// Helper to hash password using native Node.js crypto
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function getAdminData() {
  try {
    const data = await fs.readFile(adminFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return null; // File doesn't exist or is invalid
  }
}

export async function POST(request) {
  try {
    const { password, setup } = await request.json();
    const adminData = await getAdminData();

    // 1. Initial Setup Flow
    if (!adminData || setup) {
      if (!password || password.length < 6) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      const hashedPassword = hashPassword(password);
      await fs.writeFile(
        adminFilePath,
        JSON.stringify({ passwordHash: hashedPassword }, null, 2),
        "utf8"
      );

      // Log in automatically after setup
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 2, // 2 hours
      });

      return NextResponse.json({ success: true, message: "Admin password configured successfully" });
    }

    // 2. Regular Login Flow
    const inputHash = hashPassword(password);
    if (inputHash === adminData.passwordHash) {
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
  const adminData = await getAdminData();

  if (!adminData) {
    return NextResponse.json({ setupRequired: true });
  }

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
