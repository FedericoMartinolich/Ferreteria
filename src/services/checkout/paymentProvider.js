export const PAYMENT_PROVIDER_CONTRACT = [
  "id",
  "label",
  "getPaymentMethods",
  "createPayment",
  "confirmPayment",
];

const registry = new Map();

export function registerPaymentProvider(provider) {
  const missing = PAYMENT_PROVIDER_CONTRACT.filter(
    (key) => typeof provider[key] === "undefined"
  );

  if (missing.length) {
    throw new Error(
      `[payment] El proveedor "${provider.id}" no cumple el contrato: faltan ${missing.join(", ")}`
    );
  }

  registry.set(provider.id, provider);
}

export function getPaymentProviders() {
  return [...registry.values()];
}

export function getPaymentProvider(id) {
  return registry.get(id) || null;
}

export function getEnabledPaymentProviders(config) {
  const raw = config?.payment_providers || "local";
  const ids = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return ids.map((id) => registry.get(id)).filter(Boolean);
}