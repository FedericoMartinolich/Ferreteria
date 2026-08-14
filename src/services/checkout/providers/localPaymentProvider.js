function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function instructionsFor(name) {
  const key = name.toLowerCase();
  if (key.includes("efectivo") || key.includes("cash")) {
    return "Abonás en efectivo al momento de recibir tu pedido.";
  }
  if (key.includes("transferencia") || key.includes("transf")) {
    return "Te enviamos el CBU o alias por WhatsApp al confirmar tu pedido.";
  }
  if (key.includes("debito")) {
    return "Se debita de tu tarjeta al confirmar la compra.";
  }
  if (key.includes("credito")) {
    return "Se cobra en tu tarjeta al confirmar la compra.";
  }
  return "Confirmamos la modalidad de pago por WhatsApp.";
}

export const localPaymentProvider = {
  id: "local",
  label: "Pago local (efectivo / transferencia)",

  async getPaymentMethods(config) {
    const raw = config?.payment_local_methods || "Efectivo|Transferencia";
    const names = raw
      .split("|")
      .map((name) => name.trim())
      .filter(Boolean);

    return names.map((name) => ({
      id: slugify(name),
      name,
      instructions: instructionsFor(name),
    }));
  },

  async createPayment({ order, method }) {
    return {
      providerId: this.id,
      methodId: method?.id || "",
      status: "pending",
      detail: "Pago registrado, pendiente de confirmación local.",
    };
  },

  async confirmPayment({ paymentRef }) {
    return {
      providerId: this.id,
      status: "paid",
      detail: "Pago confirmado por el comercio.",
      ref: paymentRef,
    };
  },
};