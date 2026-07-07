import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { PWARegister } from "@/components/pwa-register";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "FlowLo",
    template: "%s | FlowLo",
  },
  description: "Manage stock, orders, and customer updates in one flow.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/flowlo-pwa-icon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: ["/flowlo-pwa-icon.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "rgb(10 17 28)",
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
        <PWARegister />
      </body>
    </html>
  );
}
