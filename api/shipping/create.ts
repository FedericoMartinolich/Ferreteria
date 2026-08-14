import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors, handlePreflight } from "../_lib/cors.js";

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function trackingNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const salt = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `SENV-${stamp}${salt}`;
}

function headersFor(apiKey: string) {
  return {
    "Content-Type": "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };
}

async function callProvider(payload: Record<string, unknown>) {
  const apiUrl = process.env.SHIPPING_PROVIDER_API_URL || "";
  if (!apiUrl) return null;

  const res = await fetch(`${apiUrl.replace(/\/$/, "")}/shipments`, {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  allowCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "MÃ©todo no permitido." });
  }

  const { orderId, optionId, destination, postal_code, items, weight_kg, dimensions } =
    req.body || {};

  if (!orderId) {
    return res.status(400).json({ message: "orderId es requerido." });
  }

  try {
    const providerResult = await callProvider({
      orderId,
      optionId,
      destination,
      postal_code,
      items,
      weight_kg: toNumber(weight_kg),
      dimensions,
    });

    const carrier =
      (providerResult?.carrier as string) ||
      process.env.SHIPPING_CARRIER ||
      "Correo";
    const tracking =
      (providerResult?.tracking as string) ||
      (providerResult?.trackingNumber as string) ||
      trackingNumber();
    const status =
      (providerResult?.status as string) ||
      (providerResult?.tracking ? "created" : "pending");

    return res.status(200).json({
      status,
      tracking,
      trackingNumber: tracking,
      carrier,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al generar el envÃ­o.";
    return res.status(500).json({ message });
  }
}