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
    
    const product = await db.collection('products').findOne({});
    console.log(JSON.stringify(product, null, 2));
    
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

run();
