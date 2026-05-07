import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "FlowLo",
    template: "%s | FlowLo",
  },
  description: "Clean stock. Clear orders. Faster sales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
