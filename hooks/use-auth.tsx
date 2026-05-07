"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getBusiness } from "@/lib/firestore";
import { syncSessionCookie } from "@/lib/auth";
import { Business } from "@/types";

type AuthContextValue = {
  user: User | null;
  business: Business | null;
  loading: boolean;
  businessLoading: boolean;
  refreshBusiness: () => Promise<Business | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessLoading, setBusinessLoading] = useState(true);

  const refreshBusiness = async () => {
    const ownerId = auth.currentUser?.uid;

    if (!ownerId) {
      setBusiness(null);
      setBusinessLoading(false);
      return null;
    }

    setBusinessLoading(true);

    try {
      const nextBusiness = await getBusiness(ownerId);
      setBusiness(nextBusiness);
      return nextBusiness;
    } finally {
      setBusinessLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!mounted) {
        return;
      }

      setUser(nextUser);
      syncSessionCookie(nextUser);

      if (!nextUser) {
        setBusiness(null);
        setBusinessLoading(false);
        setLoading(false);
        return;
      }

      setLoading(false);
      await refreshBusiness();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        loading,
        businessLoading,
        refreshBusiness,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
