export type BusinessCategory =
  | "Perfume"
  | "Clothing"
  | "Sneakers"
  | "Accessories"
  | "Other";

export type PaymentStatus = "unpaid" | "paid" | "partial";
export type OrderStatus = "pending" | "completed" | "cancelled";
export type DeliveryStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type OrderSource = "manual" | "whatsapp";
export type AccessRequestStatus = "pending" | "approved" | "rejected" | "disabled";
export type AccessRequestRole = "user";
export type AccessCookieStatus = AccessRequestStatus | "none";

export type Business = {
  id: string;
  businessName: string;
  category: BusinessCategory;
  ownerId: string;
  createdAt: Date | null;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  sku?: string | null;
  quantity: number;
  lowStockThreshold: number;
  costPrice?: number | null;
  sellingPrice: number;
  imageUrl?: string | null;
  ownerId: string;
  businessId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  orderTotal: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  stockDeducted: boolean;
  source: OrderSource;
  ownerId: string;
  businessId: string;
  createdAt: Date | null;
  orderNumber?: string;
  trackingId?: string;
  customerEmail?: string | null;
  deliveryStatus?: DeliveryStatus;
  deliveryAddress?: string | null;
  deliveryNotes?: string | null;
  assignedCourier?: string | null;
  estimatedDeliveryTime?: string | null;
  supportPhone?: string | null;
  updatedAt?: Date | null;
};

export type Delivery = {
  id: string;
  orderId: string;
  orderNumber: string;
  trackingId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string | null;
  assignedCourier?: string | null;
  estimatedDeliveryTime?: string | null;
  deliveryStatus: DeliveryStatus;
  supportPhone?: string | null;
  ownerId: string;
  businessId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type PublicTrackingRecord = {
  trackingId: string;
  orderNumber: string;
  customerName: string;
  deliveryStatus: DeliveryStatus;
  estimatedDeliveryTime?: string | null;
  supportPhone?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type DashboardSummary = {
  totalProducts: number;
  totalOrders: number;
  lowStockCount: number;
  totalRevenue: number;
  todaysRevenue: number;
  pendingOrdersCount: number;
  deliveryStatusSummary: {
    pending: number;
    outForDelivery: number;
    delivered: number;
    cancelled: number;
  };
  ordersToday: number;
  ordersTodayBreakdown: {
    pending: number;
    completed: number;
    cancelled: number;
  };
  unitsSoldToday: number;
  lowStockProducts: Product[];
  bestSellingProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  recentOrders: Order[];
  hasSales: boolean;
};

export type ProductPayload = {
  name: string;
  category: string;
  sku?: string | null;
  quantity: number;
  lowStockThreshold: number;
  costPrice?: number | null;
  sellingPrice: number;
  imageUrl?: string | null;
  ownerId: string;
  businessId: string;
};

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type OrderPayload = {
  customerName: string;
  customerPhone: string;
  items: OrderItemInput[];
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  source: OrderSource;
  ownerId: string;
  businessId: string;
};

export type WaitlistPayload = {
  email: string;
  name?: string;
  businessType?: string;
  whatsappNumber?: string | null;
  source: "coming-soon";
};

export type AccessRequest = {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  businessName: string;
  businessType: string;
  whatsappNumber: string;
  status: AccessRequestStatus;
  role: AccessRequestRole;
  createdAt: Date | null;
  reviewedAt: Date | null;
  reviewedBy: string | null;
};

export type AccessRequestPayload = {
  uid: string;
  fullName: string;
  email: string;
  businessName: string;
  businessType: string;
  whatsappNumber: string;
  role?: AccessRequestRole;
};
