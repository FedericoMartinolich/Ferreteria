import { MercadoPagoConfig, Preference } from "mercadopago";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors, handlePreflight } from "../_lib/cors.js";

function siteUrl() {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  allowCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "MÃ©todo no permitido." });
  }

  const expectedKey = process.env.API_ACCESS_KEY || "";
  const auth = req.headers.authorization || "";
  if (expectedKey && auth !== `Bearer ${expectedKey}`) {
    return res.status(401).json({ message: "No autorizado." });
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
  if (!token) {
    return res
      .status(500)
      .json({ message: "MERCADOPAGO_ACCESS_TOKEN no configurado en el servidor." });
  }

  const { orderId, amount, currency, customer } = req.body || {};
  const total = Number(amount);

  if (!orderId || !Number.isFinite(total) || total <= 0) {
    return res
      .status(400)
      .json({ message: "Se requieren orderId y amount mayor a 0." });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const url = siteUrl();
    const result = await preference.create({
      body: {
        external_reference: String(orderId),
        items: [
          {
            id: String(orderId),
            title: `Pedido ${orderId}`,
            quantity: 1,
            unit_price: total,
            currency_id: (currency || "ARS").toUpperCase(),
          },
        ],
        payer: { email: customer?.email || "" },
        ...(url
          ? {
              notification_url: `${url}/api/payments/webhook`,
              back_urls: { success: url, pending: url, failure: url },
              auto_return: "approved",
            }
          : {}),
      },
    });

    return res.status(200).json({
      id: result.id,
      paymentId: result.id,
      link: result.init_point,
      init_point: result.init_point,
      status: "pending",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear el pago.";
    return res.status(500).json({ message });
  }
}