import { Delivery, DeliveryStatus, Order, OrderStatus, PaymentStatus } from "@/types";

type StatusTone = "success" | "warning" | "danger" | "neutral";

const TRACKING_STEPS: Array<{
  status: Exclude<DeliveryStatus, "cancelled">;
  label: string;
}> = [
  { status: "pending", label: "Order received" },
  { status: "confirmed", label: "Confirmed" },
  { status: "packed", label: "Packed" },
  { status: "out_for_delivery", label: "Out for delivery" },
  { status: "delivered", label: "Delivered" },
];

export function buildOrderNumber(orderId: string) {
  return `FL-${orderId.slice(0, 6).toUpperCase()}`;
}

export function buildTrackingId(orderId: string) {
  return `track-${orderId}`;
}

export function parseOrderIdFromTrackingId(trackingId: string) {
  if (!trackingId.startsWith("track-")) {
    return null;
  }

  return trackingId.slice("track-".length) || null;
}

export function deriveDeliveryStatus(orderStatus: OrderStatus): DeliveryStatus {
  if (orderStatus === "completed") {
    return "delivered";
  }

  if (orderStatus === "cancelled") {
    return "cancelled";
  }

  return "pending";
}

export function normalizeDeliveryStatus(
  status: OrderStatus | DeliveryStatus | undefined | null,
): DeliveryStatus {
  if (!status) {
    return "pending";
  }

  if (
    status === "confirmed" ||
    status === "packed" ||
    status === "out_for_delivery" ||
    status === "delivered"
  ) {
    return status;
  }

  return deriveDeliveryStatus(status);
}

export function isDeliveredStatus(status: OrderStatus | DeliveryStatus) {
  return status === "completed" || status === "delivered";
}

export function getPaymentStatusLabel(status: PaymentStatus) {
  if (status === "paid") {
    return "Paid";
  }

  if (status === "partial") {
    return "Partial";
  }

  return "Unpaid";
}

export function getOrderStatusLabel(status: OrderStatus | DeliveryStatus) {
  const normalized = normalizeDeliveryStatus(status);

  if (normalized === "delivered") {
    return "Delivered";
  }

  if (normalized === "confirmed") {
    return "Confirmed";
  }

  if (normalized === "packed") {
    return "Packed";
  }

  if (normalized === "out_for_delivery") {
    return "Out for delivery";
  }

  if (normalized === "cancelled") {
    return "Cancelled";
  }

  return "Pending";
}

export function getOrderStatusTone(status: OrderStatus | DeliveryStatus): StatusTone {
  const normalized = normalizeDeliveryStatus(status);

  if (normalized === "delivered") {
    return "success";
  }

  if (normalized === "cancelled") {
    return "danger";
  }

  if (normalized === "packed" || normalized === "out_for_delivery") {
    return "warning";
  }

  return "neutral";
}

export function buildTrackingTimeline(status: OrderStatus | DeliveryStatus) {
  const normalized = normalizeDeliveryStatus(status);
  const currentIndex = normalized === "cancelled"
    ? -1
    : TRACKING_STEPS.findIndex((step) => step.status === normalized);

  return TRACKING_STEPS.map((step, index) => ({
    ...step,
    complete: currentIndex >= index,
    current: currentIndex === index,
  }));
}

export function deriveDeliveryFromOrder(order: Order): Delivery {
  const trackingId = order.trackingId ?? buildTrackingId(order.id);
  const orderNumber = order.orderNumber ?? buildOrderNumber(order.id);

  return {
    id: trackingId,
    orderId: order.id,
    orderNumber,
    trackingId,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryAddress: order.deliveryAddress ?? "",
    deliveryNotes: order.deliveryNotes ?? null,
    assignedCourier: order.assignedCourier ?? null,
    estimatedDeliveryTime: order.estimatedDeliveryTime ?? null,
    deliveryStatus: normalizeDeliveryStatus(order.deliveryStatus ?? order.orderStatus),
    supportPhone: order.supportPhone ?? null,
    ownerId: order.ownerId,
    businessId: order.businessId,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt ?? order.createdAt,
  };
}
