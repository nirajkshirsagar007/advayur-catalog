import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

// Helper to check if user is admin
async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
}

export async function GET() {
  try {
    const data = await fs.readFile(productsFilePath, "utf8");
    const products = JSON.parse(data);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read products data: " + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedProducts = await request.json();
    
    // Simple validation
    if (!Array.isArray(updatedProducts)) {
      return NextResponse.json({ error: "Invalid data format. Must be an array of products." }, { status: 400 });
    }

    // Ensure all products have required attributes
    for (const p of updatedProducts) {
      if (!p.id || !p.name || !p.description || !p.benefits || !p.price || !p.slug) {
        return NextResponse.json({ error: "Each product must contain id, name, description, benefits, price, and slug." }, { status: 400 });
      }
    }

    // Write back to products.json file
    await fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "Products updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save products: " + error.message }, { status: 500 });
  }
}
