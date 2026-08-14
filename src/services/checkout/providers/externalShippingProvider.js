function getCredentials(config) {
  return {
    apiUrl: config?.shipping_external_api_url || "",
    apiKey:
      import.meta.env.VITE_SHIPPING_API_KEY ||
      config?.shipping_external_api_key ||
      "",
  };
}

function headersFor(apiKey) {
  return {
    "Content-Type": "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };
}

function base(url) {
  return url.replace(/\/$/, "");
}

async function jsonFetch(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(body?.message || `Error del proveedor de envío (${res.status})`);
  }
  return body;
}

export const externalShippingProvider = {
  id: "external",
  label: "Empresa de envío",

  getCredentials(config) {
    return getCredentials(config);
  },

  isEnabled(config) {
    return Boolean(getCredentials(config).apiUrl);
  },

  async getOptions({ items = [], destination = "", postal_code = "", subtotal = 0, config = {} } = {}) {
    const { apiUrl, apiKey } = getCredentials(config);
    if (!apiUrl) {
      throw new Error("[shipping] Proveedor externo sin endpoint configurado.");
    }

    const result = await jsonFetch(`${base(apiUrl)}/api/shipping/quote`, {
      method: "POST",
      headers: headersFor(apiKey),
      body: JSON.stringify({
        items,
        destination,
        postal_code,
        subtotal,
        currency: "ARS",
        zones: config?.shipping_zones,
        express: config?.shipping_express === "1",
        origin: {
          postal_code: config?.codigo_postal || "",
          city: config?.ciudad || "",
          province: config?.provincia || "",
          country: config?.pais || "AR",
        },
      }),
    });

    const options = result?.options || [];
    return options.map((option) => ({
      id: option.id,
      label: option.label || "Envío",
      cost: Number(option.cost) || 0,
      eta: option.eta || option.estimated_days || "",
      provider: option.carrier || "",
      mode: option.mode || "delivery",
    }));
  },

  async createShipment({ order, option, config = {} } = {}) {
    const { apiUrl, apiKey } = getCredentials(config);
    if (!apiUrl) {
      throw new Error("[shipping] Proveedor externo sin endpoint configurado.");
    }

    return jsonFetch(`${base(apiUrl)}/api/shipping/create`, {
      method: "POST",
      headers: headersFor(apiKey),
      body: JSON.stringify({
        orderId: order.id,
        optionId: option?.id || "",
        destination: order?.customer?.address || "",
        postal_code: order?.customer?.postal_code || "",
        items: order?.items || [],
      }),
    });
  },

  async getTracking({ order, config = {} } = {}) {
    const { apiUrl, apiKey } = getCredentials(config);
    if (!apiUrl) {
      throw new Error("[shipping] Proveedor externo sin endpoint configurado.");
    }

    const trackingId = order?.shipping?.tracking || "";
    if (!trackingId) {
      return { number: null, status: order?.shipping?.status || "pending" };
    }

    return jsonFetch(`${base(apiUrl)}/shipping/tracking/${trackingId}`, {
      headers: headersFor(apiKey),
    });
  },
};