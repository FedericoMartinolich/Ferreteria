import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors, handlePreflight } from "../_lib/cors.js";

type Zone = {
  id?: string;
  label?: string;
  prefixes?: string[];
  cost?: number;
  eta?: string;
  express_cost?: number;
  express_eta?: string;
  free_over?: number;
};

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseZones(raw: unknown): Zone[] {
  if (Array.isArray(raw)) return raw as Zone[];
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Zone[];
    } catch {
      return [];
    }
  }
  return [];
}

function findZone(zones: Zone[], postal: string): Zone | null {
  const cp = postal.trim();
  if (!cp) return null;
  for (const zone of zones) {
    const prefixes = Array.isArray(zone.prefixes) ? zone.prefixes : [];
    for (const prefix of prefixes) {
      if (prefix === "*" || cp.startsWith(String(prefix))) {
        return zone;
      }
    }
  }
  return null;
}

function carrier() {
  return process.env.SHIPPING_CARRIER || "Correo";
}

function standardCost(zone: Zone, subtotal: number) {
  const freeOver = toNumber(zone.free_over);
  if (freeOver > 0 && subtotal >= freeOver) return 0;
  return toNumber(zone.cost);
}

function expressCost(zone: Zone, subtotal: number) {
  const freeOver = toNumber(zone.free_over);
  if (freeOver > 0 && subtotal >= freeOver) return 0;
  const base = toNumber(zone.cost);
  return toNumber(
    zone.express_cost,
    base + toNumber(process.env.SHIPPING_EXPRESS_SURCHARGE)
  );
}

function buildOptions(zone: Zone, subtotal: number, expressEnabled: boolean) {
  const suffix = zone.label ? ` (${zone.label})` : "";
  const zoneId = zone.id || "envio";
  const options = [
    {
      id: `domicilio-${zoneId}`,
      label: `EnvÃ­o a domicilio${suffix}`,
      cost: standardCost(zone, subtotal),
      eta: zone.eta || process.env.SHIPPING_ETA || "2 a 5 dÃ­as hÃ¡biles",
      carrier: carrier(),
      mode: "delivery",
    },
  ];

  if (expressEnabled) {
    options.push({
      id: `express-${zoneId}`,
      label: "EnvÃ­o express",
      cost: expressCost(zone, subtotal),
      eta: zone.express_eta || process.env.SHIPPING_EXPRESS_ETA || "1 a 2 dÃ­as hÃ¡biles",
      carrier: carrier(),
      mode: "delivery",
    });
  }

  return options;
}

function flatFallback(subtotal: number, expressEnabled: boolean) {
  const freeOver = toNumber(process.env.SHIPPING_FREE_OVER);
  const free = freeOver > 0 && subtotal >= freeOver;
  const baseCost = free ? 0 : toNumber(process.env.SHIPPING_FLAT_RATE, 2000);
  const options = [
    {
      id: "domicilio",
      label: "EnvÃ­o a domicilio",
      cost: baseCost,
      eta: process.env.SHIPPING_ETA || "2 a 5 dÃ­as hÃ¡biles",
      carrier: carrier(),
      mode: "delivery",
    },
  ];

  if (expressEnabled) {
    options.push({
      id: "express",
      label: "EnvÃ­o express",
      cost: free ? 0 : baseCost + toNumber(process.env.SHIPPING_EXPRESS_SURCHARGE),
      eta: process.env.SHIPPING_EXPRESS_ETA || "1 a 2 dÃ­as hÃ¡biles",
      carrier: carrier(),
      mode: "delivery",
    });
  }

  return options;
}

function headersFor(apiKey: string) {
  return {
    "Content-Type": "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };
}

async function callCourier(payload: Record<string, unknown>) {
  const apiUrl = process.env.SHIPPING_PROVIDER_API_URL || "";
  if (!apiUrl) return null;

  const res = await fetch(`${apiUrl.replace(/\/$/, "")}/quote`, {
    method: "POST",
    headers: headersFor(process.env.SHIPPING_PROVIDER_API_KEY || ""),
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(body?.message || `Error del proveedor de envÃ­o (${res.status})`);
  }
  return body;
}

function mapCourierOptions(result: { options?: unknown[] | null }) {
  const options = Array.isArray(result?.options) ? result.options : [];
  return options.map((option) => {
    const o = option as Record<string, unknown>;
    return {
      id: String(o.id || ""),
      label: String(o.label || "EnvÃ­o"),
      cost: toNumber(o.cost),
      eta: String(o.eta || o.estimated_days || ""),
      carrier: String(o.carrier || o.carrier_name || carrier()),
      mode: "delivery",
    };
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  allowCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "MÃ©todo no permitido." });
  }

  const {
    postal_code,
    destination,
    subtotal,
    items,
    weight_kg,
    dimensions,
    currency,
    zones,
    express,
    origin,
  } = req.body || {};
  const sub = toNumber(subtotal);
  const postal = typeof postal_code === "string" ? postal_code.trim() : "";

  if (!postal && !(typeof destination === "string" && destination.trim())) {
    return res
      .status(400)
      .json({ message: "Se requiere el cÃ³digo postal del destino." });
  }

  try {
    const courierResult = await callCourier({
      origin,
      destination,
      postal_code: postal,
      items,
      weight_kg: toNumber(weight_kg),
      dimensions,
      subtotal: sub,
      currency: currency || "ARS",
    });

    if (courierResult) {
      return res.status(200).json({ options: mapCourierOptions(courierResult) });
    }

    let zoneList = parseZones(zones);
    if (!zoneList.length) {
      zoneList = parseZones(process.env.SHIPPING_ZONES);
    }

    if (zoneList.length && postal) {
      const zone = findZone(zoneList, postal);
      if (!zone) {
        return res.status(200).json({
          options: [],
          message: "No hay envÃ­o disponible para ese cÃ³digo postal.",
        });
      }
      return res.status(200).json({
        options: buildOptions(zone, sub, express === true),
        zone: zone.label || "",
      });
    }

    return res.status(200).json({ options: flatFallback(sub, express === true) });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al cotizar el envÃ­o.";
    return res.status(500).json({ message });
  }
}