export const AUTH_COOKIE_NAME = "flowlo_session";
export const ACCESS_COOKIE_NAME = "flowlo_access";
export const ADMIN_COOKIE_NAME = "flowlo_admin";

export const ADMIN_EMAILS = ["ddbyalfonzo@gmail.com"] as const;

export const BUSINESS_CATEGORIES = [
  "Perfume",
  "Clothing",
  "Sneakers",
  "Accessories",
  "Other",
] as const;

export const PAYMENT_STATUSES = ["unpaid", "paid", "partial"] as const;

export const ORDER_STATUSES = ["pending", "completed", "cancelled"] as const;

export const DELIVERY_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const ORDER_SOURCES = ["manual", "whatsapp"] as const;

export const ACCESS_REQUEST_BUSINESS_TYPES = [
  "Perfume seller",
  "Clothing reseller",
  "WhatsApp shop",
  "Instagram store",
  "Local retailer",
  "Other",
] as const;

export const APP_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", compactLabel: "Dash" },
  { href: "/products", label: "Products", compactLabel: "Stock" },
  { href: "/orders", label: "Orders", compactLabel: "Orders" },
  { href: "/deliveries", label: "Deliveries", compactLabel: "Delivery" },
  { href: "/settings/business", label: "Business", compactLabel: "Biz" },
] as const;

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return ADMIN_EMAILS.includes(email.trim().toLowerCase() as (typeof ADMIN_EMAILS)[number]);
}
