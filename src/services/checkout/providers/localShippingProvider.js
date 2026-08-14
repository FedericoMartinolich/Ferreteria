function parseCost(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function effectiveCost(option, subtotal) {
  const freeOver = parseCost(option.free_over);
  if (freeOver > 0 && subtotal >= freeOver) {
    return 0;
  }
  return parseCost(option.cost);
}

function parseOptions(config) {
  const raw = config?.shipping_local_options;

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((option) => ({
          id: option.id,
          label: option.label,
          cost: parseCost(option.cost),
          eta: option.eta || "",
          free_over: parseCost(option.free_over),
          mode: option.id === "retiro" ? "pickup" : "delivery",
        }));
      }
    } catch {
      /* configuración inválida: se usan las opciones por defecto */
    }
  }

  return [
    {
      id: "retiro",
      label: config?.shipping_local_retiro_label || "Retiro en el local",
      cost: 0,
      eta: config?.shipping_local_retiro_eta || "Disponible de inmediato",
      free_over: 0,
      mode: "pickup",
    },
    {
      id: "domicilio",
      label: config?.shipping_local_domicilio_label || "Envío a domicilio",
      cost: parseCost(config?.shipping_local_domicilio_cost),
      eta: config?.shipping_local_domicilio_eta || "2 a 5 días hábiles",
      free_over: parseCost(config?.shipping_free_over),
      mode: "delivery",
    },
  ];
}

export const localShippingProvider = {
  id: "local",
  label: "Envío local",

  async getOptions({ subtotal = 0, config = {} } = {}) {
    return parseOptions(config).map((option) => ({
      id: option.id,
      label: option.label,
      eta: option.eta,
      cost: effectiveCost(option, subtotal),
      mode: option.mode || (option.id === "retiro" ? "pickup" : "delivery"),
    }));
  },

  async createShipment({ order, option }) {
    if (option?.id === "retiro") {
      return {
        providerId: this.id,
        optionId: option.id,
        status: "ready",
        tracking: null,
      };
    }

    const tracking =
      "SENV-" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 9999);

    return {
      providerId: this.id,
      optionId: option.id,
      status: "created",
      tracking,
    };
  },

  async getTracking({ order }) {
    return order?.shipping?.tracking
      ? { number: order.shipping.tracking, status: order.shipping.status }
      : { number: null, status: order?.shipping?.status || "pending" };
  },
};