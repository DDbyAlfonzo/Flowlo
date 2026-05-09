import { Delivery, PublicTrackingRecord } from "@/types";

export const DEMO_TRACKING_ID = "track-demo-order-001";

const now = new Date();
const twentyMinutesFromNow = new Date(now.getTime() + 20 * 60 * 1000);

export const mockDeliveries: Delivery[] = [
  {
    id: DEMO_TRACKING_ID,
    orderId: "demo-order-001",
    orderNumber: "FL-DEMO1",
    trackingId: DEMO_TRACKING_ID,
    customerName: "Ayanda Nkosi",
    customerPhone: "27821234567",
    deliveryAddress: "12 Rivonia Road, Sandton",
    deliveryNotes: "Call on arrival.",
    assignedCourier: "Sipho",
    estimatedDeliveryTime: twentyMinutesFromNow.toISOString(),
    deliveryStatus: "out_for_delivery",
    supportPhone: "27712345678",
    ownerId: "demo-owner",
    businessId: "demo-business",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockTrackingRecord: PublicTrackingRecord = {
  trackingId: DEMO_TRACKING_ID,
  orderNumber: "FL-DEMO1",
  customerName: "Ayanda Nkosi",
  deliveryStatus: "out_for_delivery",
  estimatedDeliveryTime: twentyMinutesFromNow.toISOString(),
  supportPhone: "27712345678",
  createdAt: now,
  updatedAt: now,
};
