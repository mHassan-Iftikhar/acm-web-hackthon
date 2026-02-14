"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<FirebaseUser>;
  signupWithEmail: (email: string, password: string) => Promise<FirebaseUser>;
  loginWithGoogle: () => Promise<FirebaseUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAuthErrorMessage(err: unknown): string {
  const code = err && typeof err === 'object' && 'code' in err
    ? (err as { code?: string }).code
    : undefined;
  if (code === 'auth/configuration-not-found') {
    return 'Authentication is not set up. Enable it in Firebase Console → Authentication → Sign-in method.';
  }
  if (code === 'auth/invalid-api-key' || code === 'auth/operation-not-allowed') {
    return 'Auth is not configured correctly. Check Firebase Console settings.';
  }
  return err && typeof err === 'object' && 'message' in err
    ? String((err as { message: unknown }).message)
    : 'Something went wrong';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            });

          // Call backend to create/update user
          const idToken = await firebaseUser.getIdToken();
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/create-user`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                displayName: firebaseUser.displayName,
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: data.data?.role || "user",
            });
          } else {
            console.error("Failed to sync user with backend");
          }
          setError(null);
        } catch (err) {
          console.error('Auth state change error:', err);
          setError('Failed to load user');
        } finally {
          setLoading(false);
        }
        setError(null);
      } catch (err) {
        console.error("Auth state change error:", err);
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe?.();
  }, []);

  const loginWithEmail = async (
    email: string,
    password: string,
  ): Promise<FirebaseUser> => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err;
    }
  };

  const signupWithEmail = async (
    email: string,
    password: string,
  ): Promise<FirebaseUser> => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return result.user;
    } catch (err: any) {
      const errorMessage = err.message || "Signup failed";
      setError(errorMessage);
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<FirebaseUser> => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err: any) {
      const errorMessage = err.message || "Google login failed";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      const errorMessage = err.message || "Logout failed";
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        logout,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
