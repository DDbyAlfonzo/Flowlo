import { Business, Order } from "@/types";

function formatWhatsAppAmount(amount: number) {
  const formatted = new Intl.NumberFormat("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `R${formatted}`;
}

function toPaymentLabel(status: Order["paymentStatus"]) {
  if (status === "paid") {
    return "Paid";
  }

  if (status === "partial") {
    return "Partial";
  }

  return "Unpaid";
}

function toOrderLabel(status: Order["orderStatus"]) {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "cancelled") {
    return "Cancelled";
  }

  return "Pending";
}

export function formatWhatsAppPhone(phone: string) {
  const digitsOnly = phone.replace(/[^\d]/g, "");

  if (!digitsOnly) {
    return "";
  }

  if (digitsOnly.startsWith("0") && digitsOnly.length === 10) {
    return `27${digitsOnly.slice(1)}`;
  }

  if (digitsOnly.startsWith("27") && digitsOnly.length === 11) {
    return digitsOnly;
  }

  return "";
}

export function buildOrderWhatsAppMessage(
  order: Order,
  business: Business | null,
) {
  const businessName = business?.businessName?.trim() || "your business";
  const orderLines = order.items
    .map(
      (item) =>
        `• ${item.quantity} × ${item.productName} — ${formatWhatsAppAmount(item.total)}`,
    )
    .join("\n");

  return [
    `Hi ${order.customerName} 👋`,
    "",
    `Thanks for your order from ${businessName}.`,
    "",
    "Order summary:",
    orderLines,
    "",
    `Total: ${formatWhatsAppAmount(order.orderTotal)}`,
    "",
    `Status: ${toPaymentLabel(order.paymentStatus)}`,
    `Order: ${toOrderLabel(order.orderStatus)}`,
    "",
    "Thank you for shopping with us 🙌",
  ].join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
