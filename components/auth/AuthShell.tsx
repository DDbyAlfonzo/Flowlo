"use client";

import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import styles from "./auth.module.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

type AuthShellProps = {
  ariaLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  landing?: boolean;
  showLogo?: boolean;
};

export function AuthShell({
  ariaLabel,
  children,
  footer,
  wide = false,
  landing = false,
  showLogo = true,
}: AuthShellProps) {
  return (
    <main className={`${styles.loginRoot} ${display.variable} ${body.variable}`}>
      <FlowLines />

      <section
        className={`${styles.loginStage} ${landing ? styles.authLandingStage : ""}`}
        aria-label={ariaLabel}
      >
        <div
          className={`${styles.loginCard} ${wide ? styles.authCardWide : ""} ${
            landing ? styles.authLandingCard : ""
          }`}
        >
          {showLogo ? (
            <img
              className={styles.loginLogo}
              src="/flowlo-continuous-flow-detailed-light.svg"
              alt="Flowlo"
              width="750"
              height="220"
              decoding="async"
            />
          ) : null}

          {children}
        </div>

        {footer}
      </section>
    </main>
  );
}

function FlowLines() {
  return (
    <div className={styles.loginBackdrop} aria-hidden="true">
      <svg
        className={`${styles.loginContours} ${styles.loginContoursTop}`}
        viewBox="0 0 900 680"
        fill="none"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 16 }).map((_, index) => (
          <path
            key={index}
            d={`M${index * 26 + 6} -20C${index * 42 + 120} 140 ${index * 38 + 500} 30 ${index * 38 + 720} 210C${index * 38 + 910} 365 ${index * 25 + 768} 600 ${index * 16 + 950} 720`}
          />
        ))}
      </svg>

      <svg
        className={`${styles.loginContours} ${styles.loginContoursBottom}`}
        viewBox="0 0 980 560"
        fill="none"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 15 }).map((_, index) => (
          <path
            key={index}
            d={`M-90 ${index * 18 + 480}C170 ${index * 4 + 180} 355 ${index * 20 + 480} 620 ${index * 12 + 200}C780 ${index * 4 + 32} 900 ${index * 9 + 190} 1060 ${index * 2 + 10}`}
          />
        ))}
      </svg>
    </div>
  );
}
