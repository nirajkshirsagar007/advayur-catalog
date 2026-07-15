import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function getAdminData() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const doc = await db.collection("settings").findOne({ _id: "admin" });
    return doc;
  } catch (error) {
    return null;
  }
}

export async function POST(request) {
  try {
    const { password, setup, action, securityQuestion, securityAnswer, newPassword } = await request.json();
    const adminData = await getAdminData();

    // 1. Forgot Password Reset Flow
    if (action === 'reset') {
      if (!adminData || !adminData.securityAnswerHash) {
        return NextResponse.json({ success: false, message: "Security question not configured." }, { status: 400 });
      }
      
      const answerHash = hashPassword(securityAnswer.toLowerCase().trim());
      if (answerHash !== adminData.securityAnswerHash) {
        return NextResponse.json({ success: false, message: "Incorrect security answer." }, { status: 401 });
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ success: false, message: "New password must be at least 6 characters long." }, { status: 400 });
      }

      const hashedPassword = hashPassword(newPassword);
      const client = await clientPromise;
      const db = client.db();
      
      await db.collection("settings").updateOne(
        { _id: "admin" },
        { $set: { passwordHash: hashedPassword } }
      );

      return NextResponse.json({ success: true, message: "Password reset successfully!" });
    }

    // 2. Initial Setup Flow
    if (!adminData || setup) {
      if (!password || password.length < 6) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 6 characters long." },
          { status: 400 }
        );
      }
      if (!securityQuestion || !securityAnswer) {
        return NextResponse.json(
          { success: false, message: "Security question and answer are required." },
          { status: 400 }
        );
      }

      const hashedPassword = hashPassword(password);
      const answerHash = hashPassword(securityAnswer.toLowerCase().trim());
      
      const client = await clientPromise;
      const db = client.db();
      
      // Upsert the admin settings document
      await db.collection("settings").updateOne(
        { _id: "admin" },
        { $set: { 
          passwordHash: hashedPassword,
          securityQuestion: securityQuestion,
          securityAnswerHash: answerHash
        } },
        { upsert: true }
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

      return NextResponse.json({ success: true, message: "Admin setup completed successfully" });
    }

    // 3. Regular Login Flow
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
  const authenticated = session && session.value === "authenticated";

  // Also return the security question (but never the answer/hash!)
  return NextResponse.json({ 
    authenticated: !!authenticated,
    securityQuestion: adminData.securityQuestion || null
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
