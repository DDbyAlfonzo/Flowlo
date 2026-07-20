"use client";

/* FlowLo — Notify customer via WhatsApp.
   No API, no cost: opens wa.me with a prefilled message for the
   order's current stage. South African numbers handled (0XX → 27XX).

   Mount on the order/delivery detail view. If the order has no
   customer phone, the button renders disabled with a hint. */

import { Inter } from "next/font/google";
import styles from "./whatsapp.module.css";

const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export type NotifyStage =
  | "pending"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered";

type NotifyCustomerButtonProps = {
  /** Customer's number in any common format: "072 123 4567", "+27721234567"… */
  phone?: string | null;
  customerName: string;
  /** e.g. "FL-WH5AXU" */
  reference: string;
  stage: NotifyStage;
  businessName: string;
  /** Override the default message entirely, if needed. */
  customMessage?: string;
  /** Full-width variant for detail pages. */
  block?: boolean;
};

export default function NotifyCustomerButton({
  phone,
  customerName,
  reference,
  stage,
  businessName,
  customMessage,
  block,
}: NotifyCustomerButtonProps) {
  const normalized = normalizeZANumber(phone ?? "");
  const message = customMessage ?? buildStageMessage({ customerName, reference, stage, businessName });

  if (!normalized) {
    return (
      <span className={`${styles.disabled} ${body.variable}`} title="Add a customer phone number to enable WhatsApp updates">
        <WhatsAppIcon />
        No number for WhatsApp
      </span>
    );
  }

  const href = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;

  return (
    <a
      className={`${styles.btn} ${block ? styles.block : ""} ${body.variable}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppIcon />
      Notify {firstName(customerName)} on WhatsApp
    </a>
  );
}

/* ---------- Message templates ---------- */

export function buildStageMessage({
  customerName,
  reference,
  stage,
  businessName,
}: {
  customerName: string;
  reference: string;
  stage: NotifyStage;
  businessName: string;
}): string {
  const name = firstName(customerName);
  switch (stage) {
    case "pending":
      return `Hi ${name}! Thanks for your order ${reference} with ${businessName}. We're on it and will confirm shortly. \u{1F64C}`;
    case "confirmed":
      return `Hi ${name}! Your order ${reference} is confirmed. We'll let you know as soon as it's packed. \u{2705}`;
    case "packed":
      return `Hi ${name}! Order ${reference} is packed and ready to go. \u{1F4E6}`;
    case "out_for_delivery":
      return `Hi ${name}! Your order ${reference} is out for delivery — keep an eye out. \u{1F69A}`;
    case "delivered":
      return `Hi ${name}! Order ${reference} has been delivered. Thanks for supporting ${businessName}! \u{1F49A}`;
  }
}

/* ---------- Helpers ---------- */

/** "072 123 4567" → "27721234567"; keeps international numbers as-is. */
export function normalizeZANumber(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (!digits) return null;
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("27")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return "27" + digits.slice(1);
  if (digits.length >= 9) return digits; // best effort for other formats
  return null;
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || "there";
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.51 14.9L2 22l5.27-1.48A9.9 9.9 0 1 0 12.04 2Zm0 1.67a8.23 8.23 0 1 1-4.2 15.32l-.3-.18-3.12.87.84-3.04-.2-.31a8.23 8.23 0 0 1 6.98-12.66Zm-3.1 4.43c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.03 2.59.12.17 1.74 2.78 4.3 3.79 2.13.84 2.56.67 3.02.63.46-.04 1.49-.61 1.7-1.2.21-.59.21-1.1.15-1.2-.06-.1-.23-.17-.48-.29-.25-.13-1.49-.74-1.72-.82-.23-.08-.4-.13-.57.12-.17.25-.65.82-.8.99-.15.17-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.55-1.36-.77-1.86-.2-.48-.4-.42-.57-.42Z" />
    </svg>
  );
}
