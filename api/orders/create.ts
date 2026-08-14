import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors, handlePreflight } from "../_lib/cors.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  allowCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "MÃ©todo no permitido." });
  }

  const order = req.body;
  if (!order?.id) {
    return res.status(400).json({ message: "order.id es requerido." });
  }

  try {
    await kv.hset(`order:${order.id}`, {
      data: JSON.stringify(order),
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ ok: true, id: order.id });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "KV no configurado (configurar KV_REST_API_URL y KV_REST_API_TOKEN).";
    return res.status(500).json({ message });
  }
}