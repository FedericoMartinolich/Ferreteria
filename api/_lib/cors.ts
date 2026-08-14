import type { VercelRequest, VercelResponse } from "@vercel/node";

export function allowCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export function handlePreflight(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    allowCors(res);
    res.status(204).end();
    return true;
  }
  return false;
}