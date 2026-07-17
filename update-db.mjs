import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

async function run() {
  try {
    const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    const uriMatch = envFile.match(/MONGODB_URI=(.*)/);
    if (!uriMatch) throw new Error("No MONGODB_URI found");
    const uri = uriMatch[1].trim();
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    
    const productsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/products.json'), 'utf8'));

    await db.collection('products').deleteMany({});
    if (productsData.length > 0) {
      await db.collection('products').insertMany(productsData);
      console.log("Successfully updated products in MongoDB.");
    }
    
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

run();
