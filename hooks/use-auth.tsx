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
import { clearAuthCookies, syncAuthCookies } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants";
import { getAccessRequest, getBusiness } from "@/lib/firestore";
import { AccessCookieStatus, AccessRequest, Business } from "@/types";

type AuthContextValue = {
  user: User | null;
  business: Business | null;
  accessRequest: AccessRequest | null;
  accessStatus: AccessCookieStatus;
  isApproved: boolean;
  isAdmin: boolean;
  loading: boolean;
  accessLoading: boolean;
  businessLoading: boolean;
  refreshBusiness: () => Promise<Business | null>;
  refreshAccessRequest: () => Promise<AccessRequest | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [accessRequest, setAccessRequest] = useState<AccessRequest | null>(null);
  const [accessStatus, setAccessStatus] = useState<AccessCookieStatus>("none");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessLoading, setAccessLoading] = useState(true);
  const [businessLoading, setBusinessLoading] = useState(true);

  const refreshBusiness = async (ownerId = auth.currentUser?.uid) => {
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

  const refreshAccessRequest = async (
    nextUser = auth.currentUser,
  ): Promise<AccessRequest | null> => {
    if (!nextUser) {
      setAccessRequest(null);
      setAccessStatus("none");
      setIsAdmin(false);
      setAccessLoading(false);
      clearAuthCookies();
      return null;
    }

    const nextAdmin = isAdminEmail(nextUser.email);
    setIsAdmin(nextAdmin);
    setAccessLoading(true);

    try {
      const nextAccessRequest = await getAccessRequest(nextUser.uid);
      const nextStatus = nextAccessRequest?.status ?? "none";

      setAccessRequest(nextAccessRequest);
      setAccessStatus(nextStatus);
      if (nextStatus !== "approved") {
        setBusiness(null);
        setBusinessLoading(false);
      }
      syncAuthCookies({
        user: nextUser,
        accessStatus: nextStatus,
        isAdmin: nextAdmin,
      });

      return nextAccessRequest;
    } catch {
      setAccessRequest(null);
      setAccessStatus("none");
      setBusiness(null);
      setBusinessLoading(false);
      syncAuthCookies({
        user: nextUser,
        accessStatus: "none",
        isAdmin: nextAdmin,
      });
      return null;
    } finally {
      setAccessLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!mounted) {
        return;
      }

      setLoading(true);
      setUser(nextUser);

      if (!nextUser) {
        setBusiness(null);
        setAccessRequest(null);
        setAccessStatus("none");
        setIsAdmin(false);
        setAccessLoading(false);
        setBusinessLoading(false);
        clearAuthCookies();
        setLoading(false);
        return;
      }

      const nextAccessRequest = await refreshAccessRequest(nextUser);

      if (!mounted) {
        return;
      }

      if (nextAccessRequest?.status === "approved") {
        await refreshBusiness(nextUser.uid);
      } else {
        setBusiness(null);
        setBusinessLoading(false);
      }

      if (!mounted) {
        return;
      }

      setLoading(false);
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
        accessRequest,
        accessStatus,
        isApproved: accessStatus === "approved",
        isAdmin,
        loading,
        accessLoading,
        businessLoading,
        refreshBusiness: () => refreshBusiness(),
        refreshAccessRequest: () => refreshAccessRequest(),
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
