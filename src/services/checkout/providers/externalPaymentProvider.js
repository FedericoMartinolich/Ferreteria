function getCredentials(config) {
  return {
    apiUrl: config?.payment_external_api_url || "",
    apiKey:
      import.meta.env.VITE_PAYMENT_API_KEY ||
      config?.payment_external_api_key ||
      "",
  };
}

function headersFor(apiKey) {
  return {
    "Content-Type": "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };
}

async function jsonFetch(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(body?.message || `Error del proveedor de pago (${res.status})`);
  }
  return body;
}

function base(url) {
  return url.replace(/\/$/, "");
}

export const externalPaymentProvider = {
  id: "external",
  label: "Pago online",

  getCredentials(config) {
    return getCredentials(config);
  },

  isEnabled(config) {
    return Boolean(getCredentials(config).apiUrl);
  },

  async getPaymentMethods(config) {
    const raw = config?.payment_external_methods || "Tarjeta de crédito|Tarjeta de débito";
    return raw
      .split("|")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({
        id: name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        name,
        instructions: "Serás redirigido al proveedor para completar el pago.",
      }));
  },

  async createPayment({ order, method, config }) {
    const { apiUrl, apiKey } = getCredentials(config);
    if (!apiUrl) {
      throw new Error("[payment] Proveedor externo sin endpoint configurado.");
    }

    try {
      await jsonFetch(`${base(apiUrl)}/api/orders/create`, {
        method: "POST",
        headers: headersFor(apiKey),
        body: JSON.stringify(order),
      });
    } catch {
      // la persistencia del pedido no debe bloquear el pago
    }

    return jsonFetch(`${base(apiUrl)}/api/payments/create`, {
      method: "POST",
      headers: headersFor(apiKey),
      body: JSON.stringify({
        orderId: order.id,
        amount: order.totals.total,
        currency: "ARS",
        method: method?.name || "card",
        customer: order.customer,
      }),
    });
  },

  async confirmPayment({ order, paymentRef, config }) {
    const { apiUrl, apiKey } = getCredentials(config);
    if (!apiUrl) {
      throw new Error("[payment] Proveedor externo sin endpoint configurado.");
    }

    const id = paymentRef?.id || paymentRef?.paymentId || order.id;
    return jsonFetch(`${apiUrl.replace(/\/$/, "")}/payments/${id}`, {
      method: "POST",
      headers: headersFor(apiKey),
      body: JSON.stringify({ action: "confirm" }),
    });
  },
};