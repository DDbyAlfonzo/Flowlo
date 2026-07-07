import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AccessRequest,
  AccessRequestPayload,
  AccessRequestStatus,
  Business,
  Delivery,
  Order,
  OrderItem,
  OrderPayload,
  Product,
  ProductPayload,
  PublicTrackingRecord,
  WaitlistPayload,
} from "@/types";
import {
  buildOrderNumber,
  buildTrackingId,
  deriveDeliveryFromOrder,
  deriveDeliveryStatus,
  parseOrderIdFromTrackingId,
} from "@/lib/order-workflow";

type FirestoreRecord = Record<string, unknown>;
type OrderQuantityItem = {
  productId: string;
  quantity: number;
};
type StockTransactionItem = {
  productRef: ReturnType<typeof doc>;
  product: Product;
  quantity: number;
};
type FirestoreTransaction = Parameters<typeof runTransaction>[1] extends (
  transaction: infer T,
) => Promise<unknown>
  ? T
  : never;

const FRIENDLY_STOCK_ERROR = "Not enough stock available to complete this order.";
const STOCK_ALREADY_UPDATED_ERROR = "This order has already updated stock.";
const CANCELLED_ORDER_COMPLETE_ERROR = "Cancelled orders cannot be completed.";
const CANCELLED_ORDER_PAID_ERROR = "Cancelled orders cannot be marked as paid.";

function toDate(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return null;
}

function sortByDateDesc<T extends { createdAt: Date | null }>(items: T[]) {
  return [...items].sort(
    (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
}

function sortByUpdatedDesc<T extends { createdAt: Date | null; updatedAt: Date | null }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    const left = a.updatedAt?.getTime() ?? a.createdAt?.getTime() ?? 0;
    const right = b.updatedAt?.getTime() ?? b.createdAt?.getTime() ?? 0;
    return right - left;
  });
}

function mapBusiness(snapshot: Awaited<ReturnType<typeof getDoc>>) {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as FirestoreRecord;
  return {
    id: snapshot.id,
    businessName: String(data.businessName ?? ""),
    category: data.category as Business["category"],
    ownerId: String(data.ownerId ?? ""),
    createdAt: toDate(data.createdAt),
  } as Business;
}

function mapProduct(snapshot: Awaited<ReturnType<typeof getDoc>>) {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as FirestoreRecord;
  return {
    id: snapshot.id,
    name: String(data.name ?? ""),
    category: String(data.category ?? ""),
    sku: data.sku ? String(data.sku) : null,
    quantity: Number(data.quantity ?? 0),
    lowStockThreshold: Number(data.lowStockThreshold ?? 0),
    costPrice:
      data.costPrice === undefined || data.costPrice === null
        ? null
        : Number(data.costPrice),
    sellingPrice: Number(data.sellingPrice ?? 0),
    imageUrl: data.imageUrl ? String(data.imageUrl) : null,
    ownerId: String(data.ownerId ?? ""),
    businessId: String(data.businessId ?? ""),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  } as Product;
}

function mapOrder(snapshot: Awaited<ReturnType<typeof getDoc>>) {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as FirestoreRecord;
  const orderStatus = (data.orderStatus as Order["orderStatus"]) ?? "pending";

  return {
    id: snapshot.id,
    customerName: String(data.customerName ?? ""),
    customerPhone: String(data.customerPhone ?? ""),
    items: Array.isArray(data.items) ? (data.items as OrderItem[]) : [],
    orderTotal: Number(data.orderTotal ?? 0),
    paymentStatus: data.paymentStatus as Order["paymentStatus"],
    orderStatus,
    stockDeducted:
      typeof data.stockDeducted === "boolean" ? data.stockDeducted : true,
    source: data.source as Order["source"],
    ownerId: String(data.ownerId ?? ""),
    businessId: String(data.businessId ?? ""),
    createdAt: toDate(data.createdAt),
    orderNumber: String(data.orderNumber ?? buildOrderNumber(snapshot.id)),
    trackingId: String(data.trackingId ?? buildTrackingId(snapshot.id)),
    customerEmail: data.customerEmail ? String(data.customerEmail) : null,
    deliveryStatus:
      (data.deliveryStatus as Order["deliveryStatus"]) ?? deriveDeliveryStatus(orderStatus),
    deliveryAddress: data.deliveryAddress ? String(data.deliveryAddress) : null,
    deliveryNotes: data.deliveryNotes ? String(data.deliveryNotes) : null,
    assignedCourier: data.assignedCourier ? String(data.assignedCourier) : null,
    estimatedDeliveryTime: data.estimatedDeliveryTime
      ? String(data.estimatedDeliveryTime)
      : null,
    supportPhone: data.supportPhone ? String(data.supportPhone) : null,
    updatedAt: toDate(data.updatedAt ?? data.createdAt),
  } as Order;
}

function mapDelivery(snapshot: Awaited<ReturnType<typeof getDoc>>) {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as FirestoreRecord;
  return {
    id: snapshot.id,
    orderId: String(data.orderId ?? ""),
    orderNumber: String(data.orderNumber ?? ""),
    trackingId: String(data.trackingId ?? snapshot.id),
    customerName: String(data.customerName ?? ""),
    customerPhone: String(data.customerPhone ?? ""),
    deliveryAddress: String(data.deliveryAddress ?? ""),
    deliveryNotes: data.deliveryNotes ? String(data.deliveryNotes) : null,
    assignedCourier: data.assignedCourier ? String(data.assignedCourier) : null,
    estimatedDeliveryTime: data.estimatedDeliveryTime
      ? String(data.estimatedDeliveryTime)
      : null,
    deliveryStatus: data.deliveryStatus as Delivery["deliveryStatus"],
    supportPhone: data.supportPhone ? String(data.supportPhone) : null,
    ownerId: String(data.ownerId ?? ""),
    businessId: String(data.businessId ?? ""),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt ?? data.createdAt),
  } as Delivery;
}

function mapAccessRequest(snapshot: Awaited<ReturnType<typeof getDoc>>) {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as FirestoreRecord;
  return {
    id: snapshot.id,
    uid: String(data.uid ?? ""),
    fullName: String(data.fullName ?? ""),
    email: String(data.email ?? ""),
    businessName: String(data.businessName ?? ""),
    businessType: String(data.businessType ?? ""),
    whatsappNumber: String(data.whatsappNumber ?? ""),
    status: data.status as AccessRequestStatus,
    role: data.role as AccessRequest["role"],
    createdAt: toDate(data.createdAt),
    reviewedAt: toDate(data.reviewedAt),
    reviewedBy: data.reviewedBy ? String(data.reviewedBy) : null,
  } as AccessRequest;
}

function mergeOrderItems(items: OrderPayload["items"]) {
  const merged = new Map<string, number>();

  for (const item of items) {
    if (!item.productId || item.quantity <= 0) {
      continue;
    }

    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }

  return Array.from(merged.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

function orderShouldDeductStock(input: {
  paymentStatus: Order["paymentStatus"];
  orderStatus: Order["orderStatus"];
}) {
  return input.paymentStatus === "paid" || input.orderStatus === "completed";
}

function buildStoredOrderItems(items: Order["items"]) {
  return mergeOrderItems(
    items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  );
}

async function loadStockTransactionItems(
  transaction: FirestoreTransaction,
  items: OrderQuantityItem[],
  ownerId: string,
  businessId: string,
) {
  const productRefs = items.map((item) => doc(db, "products", item.productId));
  const productSnapshots = await Promise.all(
    productRefs.map((productRef) => transaction.get(productRef)),
  );

  return items.map((item, index) => {
    const snapshot = productSnapshots[index];

    if (!snapshot.exists()) {
      throw new Error("One of the selected products no longer exists.");
    }

    const product = mapProduct(snapshot);

    if (!product) {
      throw new Error("Unable to read one of the selected products.");
    }

    if (product.ownerId !== ownerId || product.businessId !== businessId) {
      throw new Error("You can only sell products from your own business.");
    }

    return {
      productRef: productRefs[index],
      product,
      quantity: item.quantity,
    } satisfies StockTransactionItem;
  });
}

function ensureStockAvailable(
  items: StockTransactionItem[],
  message: string | ((product: Product) => string),
) {
  for (const item of items) {
    if (item.quantity > item.product.quantity) {
      throw new Error(
        typeof message === "function" ? message(item.product) : message,
      );
    }
  }
}

function applyStockDelta(
  transaction: FirestoreTransaction,
  items: StockTransactionItem[],
  direction: "deduct" | "restore",
) {
  for (const item of items) {
    const nextQuantity =
      direction === "deduct"
        ? item.product.quantity - item.quantity
        : item.product.quantity + item.quantity;

    transaction.update(item.productRef, {
      quantity: nextQuantity,
      updatedAt: serverTimestamp(),
    });
  }
}

function buildOrderLineItems(items: StockTransactionItem[]) {
  let orderTotal = 0;
  const finalItems: OrderItem[] = [];

  for (const item of items) {
    const lineTotal = item.product.sellingPrice * item.quantity;

    finalItems.push({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.sellingPrice,
      total: lineTotal,
    });

    orderTotal += lineTotal;
  }

  return {
    finalItems,
    orderTotal,
  };
}

async function getOrderForUpdate(transaction: FirestoreTransaction, orderId: string) {
  const orderRef = doc(db, "orders", orderId);
  const snapshot = await transaction.get(orderRef);

  if (!snapshot.exists()) {
    throw new Error("Order not found.");
  }

  const order = mapOrder(snapshot);

  if (!order) {
    throw new Error("Unable to read this order.");
  }

  return {
    orderRef,
    order,
  };
}

async function syncDeliveryFromOrder(
  transaction: FirestoreTransaction,
  order: Order,
) {
  const delivery = deriveDeliveryFromOrder(order);
  const deliveryRef = doc(db, "deliveries", delivery.trackingId);

  transaction.set(
    deliveryRef,
    {
      orderId: delivery.orderId,
      orderNumber: delivery.orderNumber,
      trackingId: delivery.trackingId,
      customerName: delivery.customerName,
      customerPhone: delivery.customerPhone,
      deliveryAddress: delivery.deliveryAddress,
      deliveryNotes: delivery.deliveryNotes ?? "",
      assignedCourier: delivery.assignedCourier ?? "",
      estimatedDeliveryTime: delivery.estimatedDeliveryTime ?? "",
      deliveryStatus: delivery.deliveryStatus,
      supportPhone: delivery.supportPhone ?? "",
      ownerId: delivery.ownerId,
      businessId: delivery.businessId,
      createdAt: order.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

function toPublicTrackingRecord(delivery: Delivery): PublicTrackingRecord {
  return {
    trackingId: delivery.trackingId,
    orderNumber: delivery.orderNumber,
    customerName: delivery.customerName,
    deliveryStatus: delivery.deliveryStatus,
    estimatedDeliveryTime: delivery.estimatedDeliveryTime,
    supportPhone: delivery.supportPhone,
    createdAt: delivery.createdAt,
    updatedAt: delivery.updatedAt,
  };
}

export async function getBusiness(ownerId: string) {
  const businessRef = doc(db, "businesses", ownerId);
  const snapshot = await getDoc(businessRef);
  return mapBusiness(snapshot);
}

export async function getAccessRequest(uid: string) {
  const accessRequestRef = doc(db, "betaAccessRequests", uid);
  const snapshot = await getDoc(accessRequestRef);
  return mapAccessRequest(snapshot);
}

export async function listAccessRequests() {
  const snapshots = await getDocs(collection(db, "betaAccessRequests"));
  const items = snapshots.docs
    .map((snapshot) => mapAccessRequest(snapshot))
    .filter((item): item is AccessRequest => Boolean(item));
  return sortByDateDesc(items);
}

export async function createAccessRequest(input: AccessRequestPayload) {
  const accessRequestRef = doc(db, "betaAccessRequests", input.uid);

  await setDoc(accessRequestRef, {
    uid: input.uid,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    businessName: input.businessName.trim(),
    businessType: input.businessType.trim(),
    whatsappNumber: input.whatsappNumber.trim(),
    status: "pending",
    role: input.role ?? "user",
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
  });

  return input.uid;
}

export async function reviewAccessRequest(
  requestId: string,
  status: Extract<AccessRequestStatus, "approved" | "rejected" | "disabled">,
  reviewedBy: string,
) {
  const accessRequestRef = doc(db, "betaAccessRequests", requestId);

  await updateDoc(accessRequestRef, {
    status,
    reviewedAt: serverTimestamp(),
    reviewedBy: reviewedBy.trim().toLowerCase(),
  });
}

export async function deleteAccessRequestRecord(requestId: string) {
  await deleteDoc(doc(db, "betaAccessRequests", requestId));
}

export async function upsertBusiness(input: {
  ownerId: string;
  businessName: string;
  category: Business["category"];
}) {
  const businessRef = doc(db, "businesses", input.ownerId);
  const existing = await getDoc(businessRef);
  const existingData = existing.exists()
    ? (existing.data() as FirestoreRecord)
    : null;

  await setDoc(
    businessRef,
    {
      businessName: input.businessName.trim(),
      category: input.category,
      ownerId: input.ownerId,
      createdAt: existingData?.createdAt ?? serverTimestamp(),
    },
    { merge: true },
  );

  return input.ownerId;
}

export async function createProduct(input: ProductPayload) {
  const productRef = doc(collection(db, "products"));

  await setDoc(productRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return productRef.id;
}

export async function updateProduct(productId: string, input: Partial<ProductPayload>) {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string) {
  const productRef = doc(db, "products", productId);
  await deleteDoc(productRef);
}

export async function getProduct(productId: string) {
  const productRef = doc(db, "products", productId);
  const snapshot = await getDoc(productRef);
  return mapProduct(snapshot);
}

export async function listProducts(ownerId: string) {
  const productsQuery = query(
    collection(db, "products"),
    where("ownerId", "==", ownerId),
  );
  const snapshots = await getDocs(productsQuery);
  const items = snapshots.docs
    .map((snapshot) => mapProduct(snapshot))
    .filter((item): item is Product => Boolean(item));
  return sortByDateDesc(items);
}

export async function listOrders(ownerId: string) {
  const ordersQuery = query(
    collection(db, "orders"),
    where("ownerId", "==", ownerId),
  );
  const snapshots = await getDocs(ordersQuery);
  const items = snapshots.docs
    .map((snapshot) => mapOrder(snapshot))
    .filter((item): item is Order => Boolean(item));
  return sortByDateDesc(items);
}

export async function getOrder(orderId: string) {
  const orderRef = doc(db, "orders", orderId);
  const snapshot = await getDoc(orderRef);
  return mapOrder(snapshot);
}

export async function listDeliveries(ownerId: string) {
  const [deliverySnapshots, orders] = await Promise.all([
    getDocs(
      query(collection(db, "deliveries"), where("ownerId", "==", ownerId)),
    ),
    listOrders(ownerId),
  ]);

  const deliveries = deliverySnapshots.docs
    .map((snapshot) => mapDelivery(snapshot))
    .filter((item): item is Delivery => Boolean(item));
  const deliveryMap = new Map(deliveries.map((delivery) => [delivery.trackingId, delivery]));

  for (const order of orders) {
    const fallbackDelivery = deriveDeliveryFromOrder(order);
    if (!deliveryMap.has(fallbackDelivery.trackingId)) {
      deliveryMap.set(fallbackDelivery.trackingId, fallbackDelivery);
    }
  }

  return sortByUpdatedDesc(Array.from(deliveryMap.values()));
}

export async function getDeliveryByOrderId(orderId: string) {
  const order = await getOrder(orderId);

  if (!order) {
    return null;
  }

  const deliveryRef = doc(db, "deliveries", order.trackingId ?? buildTrackingId(order.id));
  const snapshot = await getDoc(deliveryRef);
  return mapDelivery(snapshot) ?? deriveDeliveryFromOrder(order);
}

export async function getPublicTrackingRecord(trackingId: string) {
  const normalizedTrackingId = trackingId.trim();
  const deliveryRef = doc(db, "deliveries", normalizedTrackingId);
  const deliverySnapshot = await getDoc(deliveryRef);
  const delivery = mapDelivery(deliverySnapshot);

  if (delivery) {
    return toPublicTrackingRecord(delivery);
  }

  const orderId = parseOrderIdFromTrackingId(normalizedTrackingId);

  if (!orderId) {
    return null;
  }

  const order = await getOrder(orderId);

  if (!order) {
    return null;
  }

  return toPublicTrackingRecord(deriveDeliveryFromOrder(order));
}

export async function createOrder(input: OrderPayload) {
  const normalizedItems = mergeOrderItems(input.items);

  if (!normalizedItems.length) {
    throw new Error("Add at least one product to the order.");
  }

  return runTransaction(db, async (transaction) => {
    const stockItems = await loadStockTransactionItems(
      transaction,
      normalizedItems,
      input.ownerId,
      input.businessId,
    );
    const shouldDeduct = orderShouldDeductStock(input);

    ensureStockAvailable(stockItems, (product) => {
      if (shouldDeduct) {
        return FRIENDLY_STOCK_ERROR;
      }

      return `${product.name} does not have enough stock left.`;
    });

    const { finalItems, orderTotal } = buildOrderLineItems(stockItems);

    if (shouldDeduct) {
      applyStockDelta(transaction, stockItems, "deduct");
    }

    const orderRef = doc(collection(db, "orders"));
    const trackingId = buildTrackingId(orderRef.id);
    const orderNumber = buildOrderNumber(orderRef.id);
    const deliveryStatus = deriveDeliveryStatus(input.orderStatus);

    transaction.set(orderRef, {
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      items: finalItems,
      orderTotal,
      paymentStatus: input.paymentStatus,
      orderStatus: input.orderStatus,
      stockDeducted: shouldDeduct,
      source: input.source,
      ownerId: input.ownerId,
      businessId: input.businessId,
      createdAt: serverTimestamp(),
      orderNumber,
      trackingId,
      deliveryStatus,
      updatedAt: serverTimestamp(),
    });

    transaction.set(doc(db, "deliveries", trackingId), {
      orderId: orderRef.id,
      orderNumber,
      trackingId,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      deliveryAddress: "",
      deliveryNotes: "",
      assignedCourier: "",
      estimatedDeliveryTime: "",
      deliveryStatus,
      supportPhone: "",
      ownerId: input.ownerId,
      businessId: input.businessId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return orderRef.id;
  });
}

export async function markOrderAsPaid(orderId: string) {
  return runTransaction(db, async (transaction) => {
    const { orderRef, order } = await getOrderForUpdate(transaction, orderId);

    if (order.orderStatus === "cancelled") {
      throw new Error(CANCELLED_ORDER_PAID_ERROR);
    }

    if (order.paymentStatus === "paid" && order.stockDeducted) {
      throw new Error(STOCK_ALREADY_UPDATED_ERROR);
    }

    let stockDeducted = order.stockDeducted;

    if (!stockDeducted) {
      const stockItems = await loadStockTransactionItems(
        transaction,
        buildStoredOrderItems(order.items),
        order.ownerId,
        order.businessId,
      );
      ensureStockAvailable(stockItems, FRIENDLY_STOCK_ERROR);
      applyStockDelta(transaction, stockItems, "deduct");
      stockDeducted = true;
    }

    transaction.update(orderRef, {
      paymentStatus: "paid",
      stockDeducted,
      updatedAt: serverTimestamp(),
    });

    await syncDeliveryFromOrder(transaction, {
      ...order,
      paymentStatus: "paid",
      stockDeducted,
      updatedAt: new Date(),
    });
  });
}

export async function completeOrder(orderId: string) {
  return runTransaction(db, async (transaction) => {
    const { orderRef, order } = await getOrderForUpdate(transaction, orderId);

    if (order.orderStatus === "cancelled") {
      throw new Error(CANCELLED_ORDER_COMPLETE_ERROR);
    }

    if (order.orderStatus === "completed" && order.stockDeducted) {
      throw new Error(STOCK_ALREADY_UPDATED_ERROR);
    }

    let stockDeducted = order.stockDeducted;

    if (!stockDeducted) {
      const stockItems = await loadStockTransactionItems(
        transaction,
        buildStoredOrderItems(order.items),
        order.ownerId,
        order.businessId,
      );
      ensureStockAvailable(stockItems, FRIENDLY_STOCK_ERROR);
      applyStockDelta(transaction, stockItems, "deduct");
      stockDeducted = true;
    }

    transaction.update(orderRef, {
      orderStatus: "completed",
      deliveryStatus: "delivered",
      stockDeducted,
      updatedAt: serverTimestamp(),
    });

    await syncDeliveryFromOrder(transaction, {
      ...order,
      orderStatus: "completed",
      deliveryStatus: "delivered",
      stockDeducted,
      updatedAt: new Date(),
    });
  });
}

export async function cancelOrder(orderId: string) {
  return runTransaction(db, async (transaction) => {
    const { orderRef, order } = await getOrderForUpdate(transaction, orderId);

    if (order.stockDeducted) {
      const stockItems = await loadStockTransactionItems(
        transaction,
        buildStoredOrderItems(order.items),
        order.ownerId,
        order.businessId,
      );
      applyStockDelta(transaction, stockItems, "restore");

      transaction.update(orderRef, {
        orderStatus: "cancelled",
        deliveryStatus: "cancelled",
        stockDeducted: false,
        updatedAt: serverTimestamp(),
      });

      await syncDeliveryFromOrder(transaction, {
        ...order,
        orderStatus: "cancelled",
        deliveryStatus: "cancelled",
        stockDeducted: false,
        updatedAt: new Date(),
      });

      return;
    }

    if (order.orderStatus === "cancelled") {
      return;
    }

    transaction.update(orderRef, {
      orderStatus: "cancelled",
      deliveryStatus: "cancelled",
      updatedAt: serverTimestamp(),
    });

    await syncDeliveryFromOrder(transaction, {
      ...order,
      orderStatus: "cancelled",
      deliveryStatus: "cancelled",
      updatedAt: new Date(),
    });
  });
}

export async function createWaitlistEntry(input: WaitlistPayload) {
  const waitlistRef = doc(collection(db, "waitlist"));
  const waitlistData: Record<string, unknown> = {
    email: input.email.trim().toLowerCase(),
    createdAt: serverTimestamp(),
    source: input.source,
  };

  if (input.name?.trim()) {
    waitlistData.name = input.name.trim();
  }

  if (input.businessType?.trim()) {
    waitlistData.businessType = input.businessType.trim();
  }

  const whatsappNumber = input.whatsappNumber?.trim();

  if (whatsappNumber) {
    waitlistData.whatsappNumber = whatsappNumber;
  }

  await setDoc(waitlistRef, waitlistData);

  return waitlistRef.id;
}
