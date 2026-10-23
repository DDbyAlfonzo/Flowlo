"use client";

import type { ReactNode } from "react";
import LightAppShell from "@/components/redesign/LightAppShell";

type AppShellProps = {
  children: ReactNode;
  /** false = admin screens (no business navigation). */
  showNav?: boolean;
  /** Kept for call-site compatibility; headings live in each page now. */
  shellTitle?: string;
  shellSubtitle?: string;
};

export function AppShell({ children, showNav = true }: AppShellProps) {
  return <LightAppShell admin={!showNav}>{children}</LightAppShell>;
}
