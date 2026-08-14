export const SHIPPING_PROVIDER_CONTRACT = [
  "id",
  "label",
  "getOptions",
  "createShipment",
  "getTracking",
];

const registry = new Map();

export function registerShippingProvider(provider) {
  const missing = SHIPPING_PROVIDER_CONTRACT.filter(
    (key) => typeof provider[key] === "undefined"
  );

  if (missing.length) {
    throw new Error(
      `[shipping] El proveedor "${provider.id}" no cumple el contrato: faltan ${missing.join(", ")}`
    );
  }

  registry.set(provider.id, provider);
}

export function getShippingProviders() {
  return [...registry.values()];
}

export function getShippingProvider(id) {
  return registry.get(id) || null;
}

export function getEnabledShippingProviders(config) {
  const raw = config?.shipping_providers || "local";
  const ids = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return ids.map((id) => registry.get(id)).filter(Boolean);
}