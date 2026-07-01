import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

// Helper to check if user is admin
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

    // Read file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename
    const originalName = file.name || "image.jpg";
    const ext = path.extname(originalName) || ".jpg";
    const filename = `product-${Date.now()}${ext}`;

    // Target upload folder in public
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write file to uploads directory
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return the relative URL path to access from public/uploads
    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}` 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Upload failed: " + error.message 
    }, { status: 500 });
  }
}
