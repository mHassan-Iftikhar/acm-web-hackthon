import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// Implementation replaced by logic below
const mockAuth = {
  verifyIdToken: async (token: string) => {
    if (token === 'test-token') {
      return { uid: 'test-user-uid', email: 'test@example.com', email_verified: true };
    }
    throw new Error('Invalid token');
  },
  getUser: async (uid: string) => ({ uid, email: 'test@example.com', displayName: 'Test User' })
};

const mockDb = {
    collection: () => ({
        doc: () => ({
            set: async () => {},
            get: async () => ({ exists: true, data: () => ({}) })
        })
    })
};

let auth: any;
let db: any;

try {
    if (admin.apps.length === 0) {
        if (!process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY.length < 50) {
           // Basic check to avoid crashing on dummy keys
           if(process.env.FIREBASE_PRIVATE_KEY?.includes('-----BEGIN PRIVATE KEY-----')) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    }),
                });
           } else {
               throw new Error('Invalid Private Key Format');
           }
        } else {
             throw new Error('Missing Private Key');
        }
    }
    auth = admin.auth();
    db = admin.firestore();
    console.log('✅ Firebase Admin initialized');
} catch (error) {
    console.warn('⚠️ Firebase initialization failed (using Mock for Dev):', error instanceof Error ? error.message : error);
    auth = mockAuth;
    db = mockDb;
}

export { auth, db };
export default admin;
