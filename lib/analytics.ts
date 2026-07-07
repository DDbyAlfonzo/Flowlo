import { listDeliveries, listOrders, listProducts } from "@/lib/firestore";
import { DashboardSummary, Delivery, Order, Product } from "@/types";

function startOfToday() {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  return value;
}

function sortByDateDesc<T extends { createdAt: Date | null }>(items: T[]) {
  return [...items].sort(
    (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
}

function isCountedRevenueOrder(order: Order) {
  return (
    order.orderStatus !== "cancelled" &&
    (order.paymentStatus === "paid" || order.orderStatus === "completed")
  );
}

function isCountedTodaysRevenueOrder(order: Order) {
  return (
    order.orderStatus !== "pending" &&
    order.orderStatus !== "cancelled" &&
    (order.paymentStatus === "paid" || order.orderStatus === "completed")
  );
}

function isCreatedToday(order: Order, todayStart: Date) {
  return Boolean(order.createdAt && order.createdAt >= todayStart);
}

function filterBusinessRecords<T extends { businessId: string }>(
  items: T[],
  businessId: string,
) {
  return items.filter((item) => item.businessId === businessId);
}

function getLowStockProducts(products: Product[]) {
  return [...products]
    .filter((product) => product.quantity <= product.lowStockThreshold)
    .sort((a, b) => {
      if (a.quantity !== b.quantity) {
        return a.quantity - b.quantity;
      }

      return a.lowStockThreshold - b.lowStockThreshold;
    })
    .slice(0, 5);
}

function getBestSellingProducts(orders: Order[]) {
  const bestSellerMap = new Map<
    string,
    { productId: string; productName: string; quantitySold: number; revenue: number }
  >();

  for (const order of orders) {
    if (!isCountedRevenueOrder(order)) {
      continue;
    }

    for (const item of order.items) {
      const current = bestSellerMap.get(item.productId);

      if (current) {
        current.quantitySold += item.quantity;
        current.revenue += item.total;
        continue;
      }

      bestSellerMap.set(item.productId, {
        productId: item.productId,
        productName: item.productName,
        quantitySold: item.quantity,
        revenue: item.total,
      });
    }
  }

  return Array.from(bestSellerMap.values())
    .sort((a, b) => {
      if (b.quantitySold !== a.quantitySold) {
        return b.quantitySold - a.quantitySold;
      }

      return b.revenue - a.revenue;
    })
    .slice(0, 5);
}

function getDeliveryStatusSummary(deliveries: Delivery[]) {
  return deliveries.reduce(
    (summary, delivery) => {
      if (delivery.deliveryStatus === "delivered") {
        summary.delivered += 1;
        return summary;
      }

      if (delivery.deliveryStatus === "out_for_delivery") {
        summary.outForDelivery += 1;
        return summary;
      }

      if (delivery.deliveryStatus === "cancelled") {
        summary.cancelled += 1;
        return summary;
      }

      summary.pending += 1;
      return summary;
    },
    {
      pending: 0,
      outForDelivery: 0,
      delivered: 0,
      cancelled: 0,
    },
  );
}

export function calculateDashboardAnalytics(input: {
  orders: Order[];
  products: Product[];
  deliveries: Delivery[];
}): DashboardSummary {
  const todayStart = startOfToday();
  const orders = sortByDateDesc(input.orders);
  const products = [...input.products];
  const deliveries = sortByDateDesc(input.deliveries);
  const revenueOrders = orders.filter(isCountedRevenueOrder);
  const todaysOrders = orders.filter((order) => isCreatedToday(order, todayStart));
  const todaysRevenueOrders = todaysOrders.filter(isCountedTodaysRevenueOrder);

  const totalRevenue = revenueOrders.reduce(
    (sum, order) => sum + order.orderTotal,
    0,
  );
  const todaysRevenue = todaysRevenueOrders.reduce(
    (sum, order) => sum + order.orderTotal,
    0,
  );
  const unitsSoldToday = todaysRevenueOrders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
    );
  }, 0);

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    lowStockCount: products.filter(
      (product) => product.quantity <= product.lowStockThreshold,
    ).length,
    totalRevenue,
    todaysRevenue,
    pendingOrdersCount: orders.filter((order) => order.orderStatus === "pending").length,
    deliveryStatusSummary: getDeliveryStatusSummary(deliveries),
    ordersToday: todaysOrders.length,
    ordersTodayBreakdown: {
      pending: todaysOrders.filter((order) => order.orderStatus === "pending").length,
      completed: todaysOrders.filter((order) => order.orderStatus === "completed").length,
      cancelled: todaysOrders.filter((order) => order.orderStatus === "cancelled").length,
    },
    unitsSoldToday,
    lowStockProducts: getLowStockProducts(products),
    bestSellingProducts: getBestSellingProducts(orders),
    recentOrders: orders.slice(0, 5),
    hasSales: revenueOrders.length > 0,
  };
}

export async function getDashboardAnalytics(ownerId: string, businessId: string) {
  const [orders, products, deliveries] = await Promise.all([
    listOrders(ownerId),
    listProducts(ownerId),
    listDeliveries(ownerId),
  ]);

  return calculateDashboardAnalytics({
    orders: filterBusinessRecords(orders, businessId),
    products: filterBusinessRecords(products, businessId),
    deliveries: filterBusinessRecords(deliveries, businessId),
  });
}
