"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/loading-screen";
import RequestAccessScreenV3, { type RequestAccessValues } from "@/components/redesign/RequestAccessScreenV3";
import { logoutUser, registerWithEmail } from "@/lib/auth";
import { ACCESS_REQUEST_BUSINESS_TYPES } from "@/lib/constants";
import { createAccessRequest } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { user, business, isAdmin, isApproved, loading, accessLoading, businessLoading } = useAuth();
  const [initialEmail, setInitialEmail] = useState<string | null>(null);
  const [hasShownForm, setHasShownForm] = useState(false);

  useEffect(() => {
    // Landing hands over the email someone already typed (?email=...).
    const params = new URLSearchParams(window.location.search);
    setInitialEmail(params.get("email") ?? "");
  }, []);

  useEffect(() => {
    if (loading || accessLoading || !user) {
      return;
    }

    if (isAdmin) {
      router.replace("/admin/access-requests");
      return;
    }

    if (isApproved && !businessLoading) {
      router.replace(business ? "/dashboard" : "/settings/business");
    }
  }, [
    accessLoading,
    business,
    businessLoading,
    isAdmin,
    isApproved,
    loading,
    router,
    user,
  ]);

  useEffect(() => {
    if (!hasShownForm && !loading && !accessLoading && initialEmail !== null && !(user && isApproved)) {
      setHasShownForm(true);
    }
  }, [accessLoading, hasShownForm, initialEmail, isApproved, loading, user]);

  const handleSubmit = async (values: RequestAccessValues) => {
    try {
      const credential = await registerWithEmail({
        email: values.email,
        password: values.password,
      });

      await createAccessRequest({
        uid: credential.user.uid,
        fullName: values.fullName,
        email: values.email,
        businessName: values.businessName,
        businessType: values.businessType,
        whatsappNumber: values.whatsappNumber,
        role: "user",
      });

      await logoutUser();
    } catch (submitError) {
      await logoutUser();
      throw submitError instanceof Error
        ? submitError
        : new Error("We could not send your access request.");
    }
  };

  const booting =
    loading || accessLoading || (user && isApproved && businessLoading) || initialEmail === null;

  // Sign-up briefly signs the new user in and out again. Keep the form
  // mounted through that, so its "request sent" state isn't lost.
  if (booting && !hasShownForm) {
    return <LoadingScreen message="Getting things ready..." />;
  }

  return (
    <RequestAccessScreenV3
      businessTypes={ACCESS_REQUEST_BUSINESS_TYPES}
      initialEmail={initialEmail ?? ""}
      onSubmit={handleSubmit}
      signInHref="/login"
    />
  );
}
