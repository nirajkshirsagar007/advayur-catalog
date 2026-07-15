import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { getGlobalSettings } from "@/lib/settings";

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
}

export async function GET() {
  const settings = await getGlobalSettings();
  return NextResponse.json(settings);
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validate inputs
    if (data.whatsappNumber && !/^\d{10,15}$/.test(data.whatsappNumber)) {
      return NextResponse.json(
        { error: "Invalid WhatsApp Number. It must contain only numbers and be 10-15 digits long." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Update global settings
    await db.collection("settings").updateOne(
      { _id: "global" },
      { $set: data },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
