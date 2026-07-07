import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import cloudinary from "@/lib/cloudinary";

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload via SDK in serverless
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload directly to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "advayur-catalog",
      resource_type: "image",
    });

    // Return the secure Cloudinary URL
    return NextResponse.json({ 
      success: true, 
      url: uploadResponse.secure_url 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Upload failed: " + error.message 
    }, { status: 500 });
  }
}
