import { Inter, Space_Grotesk } from "next/font/google";

/* Shared fonts for the v3 light screens (landing, sign in, dashboard).
   Exposed as CSS variables so each module can reference them. */
export const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--fl-display",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fl-body",
});

export const fontVars = `${displayFont.variable} ${bodyFont.variable}`;
