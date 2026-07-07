import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

function extractCloudinaryPublicId(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length !== 2) return null;
    const pathWithVersion = parts[1];
    const pathParts = pathWithVersion.split('/');
    if (pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }
    const publicIdWithExt = pathParts.join('/');
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return publicIdWithExt.substring(0, lastDotIndex);
    }
    return publicIdWithExt;
  } catch (e) {
    return null;
  }
}

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
}

async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('products');
}

export async function GET() {
  try {
    const collection = await getCollection();
    // Retrieve all products without the MongoDB specific _id or mapping it out
    const products = await collection.find({}).toArray();
    
    // Map _id out for cleaner JSON output
    const formattedProducts = products.map(p => {
      const { _id, ...rest } = p;
      return rest;
    });

    return NextResponse.json(formattedProducts);
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
    
    if (!Array.isArray(updatedProducts)) {
      return NextResponse.json({ error: "Invalid data format. Must be an array of products." }, { status: 400 });
    }

    for (const p of updatedProducts) {
      if (!p.id || !p.name || !p.description || !p.benefits || !p.price || !p.slug) {
        return NextResponse.json({ error: "Each product must contain id, name, description, benefits, price, and slug." }, { status: 400 });
      }
    }

    const collection = await getCollection();
    
    // Find all existing products before deleting them
    const existingProducts = await collection.find({}).toArray();
    
    // Extract all image URLs from existing products
    const oldImageUrls = existingProducts.map(p => p.image).filter(Boolean);
    
    // Extract all image URLs from the updated list
    const newImageUrls = updatedProducts.map(p => p.image).filter(Boolean);
    
    // Find URLs that exist in the old list but NOT in the new list (these were deleted or replaced)
    const orphanedImageUrls = oldImageUrls.filter(url => !newImageUrls.includes(url));
    
    // Delete orphaned images from Cloudinary
    for (const url of orphanedImageUrls) {
      const publicId = extractCloudinaryPublicId(url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.error(`Failed to delete Cloudinary image: ${publicId}`, e);
        }
      }
    }
    
    // Drop all existing products and insert the new array.
    await collection.deleteMany({});
    
    if (updatedProducts.length > 0) {
      await collection.insertMany(updatedProducts);
    }

    return NextResponse.json({ success: true, message: "Products updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save products: " + error.message }, { status: 500 });
  }
}
