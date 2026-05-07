"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/loading-screen";

type ProtectedPageProps = {
  children: ReactNode;
  requireBusiness?: boolean;
};

export function ProtectedPage({
  children,
  requireBusiness = true,
}: ProtectedPageProps) {
  const { user, business, loading, businessLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  useEffect(() => {
    if (!loading && user && requireBusiness && !businessLoading && !business) {
      router.replace("/settings/business");
    }
  }, [business, businessLoading, loading, requireBusiness, router, user]);

  if (loading || (user && requireBusiness && businessLoading)) {
    return <LoadingScreen message="Loading your workspace..." />;
  }

  if (!user) {
    return <LoadingScreen message="Taking you to login..." />;
  }

  if (requireBusiness && !business) {
    return <LoadingScreen message="Taking you to business setup..." />;
  }

  return <>{children}</>;
}
