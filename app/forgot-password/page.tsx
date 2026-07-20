"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import ForgotPasswordScreen from "@/components/auth/ForgotPasswordScreen";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  return (
    <ForgotPasswordScreen
      onSendReset={(email) => sendPasswordResetEmail(auth, email)}
    />
  );
}
