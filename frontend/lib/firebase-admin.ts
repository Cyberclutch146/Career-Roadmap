import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    let credential;
    try {
      const serviceAccount = require('../../backend/serviceAccountKey.json');
      credential = admin.credential.cert(serviceAccount);
    } catch (e) {
      // Fallback to env vars if file not found
      if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        credential = admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        });
      }
    }

    if (credential) {
      admin.initializeApp({
        credential,
      });
      console.log('Firebase Admin initialized successfully.');
    } else {
      console.warn('Firebase Admin credentials not found. Initialization deferred/skipped.');
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop, receiver) {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin is not initialized. Check credentials.');
    }
    const db = admin.firestore();
    const value = Reflect.get(db, prop);
    return typeof value === 'function' ? value.bind(db) : value;
  }
});

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(target, prop, receiver) {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin is not initialized. Check credentials.');
    }
    const auth = admin.auth();
    const value = Reflect.get(auth, prop);
    return typeof value === 'function' ? value.bind(auth) : value;
  }
});

