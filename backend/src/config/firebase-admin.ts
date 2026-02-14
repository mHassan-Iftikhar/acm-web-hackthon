import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load backend/.env so FIREBASE_* are set even when process.cwd() is project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
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
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        let key = process.env.FIREBASE_PRIVATE_KEY?.trim() || '';

        if (!projectId || !clientEmail) {
            throw new Error('Missing FIREBASE_PROJECT_ID or FIREBASE_CLIENT_EMAIL in .env');
        }
        // Support key with escaped \n (from .env) or real newlines
        if (key.includes('\\n')) {
            key = key.replace(/\\n/g, '\n');
        }
        const hasValidKey = key.length >= 100 && key.includes('-----BEGIN PRIVATE KEY-----') && key.includes('-----END PRIVATE KEY-----');

        if (hasValidKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: key,
                }),
            });
        } else {
            throw new Error('Missing or invalid FIREBASE_PRIVATE_KEY. Use the full private key from Firebase Console → Project Settings → Service Accounts → Generate new private key (paste the "private_key" value into .env, keep the \\n as-is).');
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
