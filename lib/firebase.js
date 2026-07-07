import admin from 'firebase-admin';

// Protect against multiple initializations in Next.js development mode
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // We replace \n with actual newline characters so it parses correctly from env
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error('Firebase admin initialization error:', error.stack);
  }
}

export const db = admin.firestore();
export const storage = admin.storage().bucket();
