import clientPromise from "./mongodb";

const DEFAULT_SETTINGS = {
  whatsappNumber: "917038369618",
};

export async function getGlobalSettings() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const doc = await db.collection("settings").findOne({ _id: "global" });
    
    if (doc) {
      return { ...DEFAULT_SETTINGS, ...doc };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
    return DEFAULT_SETTINGS;
  }
}
