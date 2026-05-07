export const AUTH_COOKIE_NAME = "flowlo_session";

export const BUSINESS_CATEGORIES = [
  "Perfume",
  "Clothing",
  "Sneakers",
  "Accessories",
  "Other",
] as const;

export const PAYMENT_STATUSES = ["unpaid", "paid", "partial"] as const;

export const ORDER_STATUSES = ["pending", "completed", "cancelled"] as const;

export const ORDER_SOURCES = ["manual", "whatsapp"] as const;

export const APP_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
  { href: "/settings/business", label: "Business" },
];
