import { MercadoPagoConfig, Payment } from "mercadopago";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors, handlePreflight } from "../_lib/cors.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  allowCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method === "GET") {
    return res.status(200).send("OK");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "MÃ©todo no permitido." });
  }

  const type = req.body?.type;
  const paymentId = Number(req.body?.data?.id);

  if (type !== "payment" || !paymentId) {
    return res.status(200).json({ ok: true });
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
  if (!token) {
    return res
      .status(500)
      .json({ message: "MERCADOPAGO_ACCESS_TOKEN no configurado en el servidor." });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: token });
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: paymentId });

    return res.status(200).json({
      ok: true,
      payment_id: paymentId,
      status: payment.status,
      external_reference: payment.external_reference,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al consultar el pago.";
    return res.status(500).json({ message });
  }
}