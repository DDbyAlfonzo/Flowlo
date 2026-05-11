import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "FlowLo",
    template: "%s | FlowLo",
  },
  description: "Manage stock, orders, and customer updates in one flow.",
  icons: {
    icon: [
      { url: "/flowlo-logo-mark.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/flowlo-logo-mark.svg", type: "image/svg+xml", sizes: "180x180" },
    ],
    shortcut: ["/flowlo-logo-mark.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
