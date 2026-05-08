export type BusinessCategory =
  | "Perfume"
  | "Clothing"
  | "Sneakers"
  | "Accessories"
  | "Other";

export type PaymentStatus = "unpaid" | "paid" | "partial";
export type OrderStatus = "pending" | "completed" | "cancelled";
export type OrderSource = "manual" | "whatsapp";

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
};

export type DashboardSummary = {
  totalProducts: number;
  lowStockCount: number;
  totalRevenue: number;
  todaysRevenue: number;
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
  name: string;
  email: string;
  businessType: string;
  whatsappNumber?: string | null;
  source: "coming-soon";
};
