const ORDERS_KEY = "orders";

function readOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent("orders-updated", { detail: orders }));
}

function uid() {
  const stamp = Date.now().toString(36).toUpperCase();
  const salt = Math.random().toString(36).slice(2, 6).toUpperCase();
  return "ORD-" + stamp + salt;
}

export function createOrder({ items, customer, totals, payment, shipping }) {
  const order = {
    id: uid(),
    createdAt: new Date().toISOString(),
    items: (items || []).map(({ id, name, sku, price, qty }) => ({
      id,
      name,
      sku,
      price: Number(price) || 0,
      qty: Number(qty) || 1,
    })),
    customer: { ...customer },
    totals: {
      products: Number(totals?.products) || 0,
      shipping: Number(totals?.shipping) || 0,
      total: Number(totals?.total) || 0,
    },
    payment: {
      providerId: payment?.providerId || "",
      methodId: payment?.methodId || "",
      status: "pending",
      detail: "",
    },
    shipping: {
      providerId: shipping?.providerId || "",
      optionId: shipping?.optionId || "",
      status: "pending",
      tracking: null,
    },
  };

  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  return order;
}

export function getOrders() {
  return readOrders();
}

export function getOrderById(id) {
  return readOrders().find((order) => order.id === id) || null;
}

export function updateOrder(id, patch) {
  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...patch };
  writeOrders(orders);
  return orders[index];
}

export function setPaymentStatus(id, status, detail = "") {
  const order = getOrderById(id);
  if (!order) return null;
  return updateOrder(id, {
    payment: {
      ...order.payment,
      status,
      detail: detail || order.payment.detail,
    },
  });
}

export function setShippingStatus(id, status, { tracking } = {}) {
  const order = getOrderById(id);
  if (!order) return null;
  return updateOrder(id, {
    shipping: {
      ...order.shipping,
      status,
      tracking: typeof tracking === "string" ? tracking : order.shipping.tracking,
    },
  });
}