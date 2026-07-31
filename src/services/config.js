import Papa from "papaparse";

const BASE = import.meta.env.VITE_SHEET_BASE_URL;
const GID = import.meta.env.VITE_CONFIG_GID;
const URL = GID ? `${BASE}&gid=${GID}` : BASE;

let cached = null;

export async function getConfig() {
  if (cached) return cached;

  const res = await fetch(URL);
  const csv = await res.text();

  const { data } = Papa.parse(csv, {
    skipEmptyLines: true,
  });

  const config = {};
  data.forEach(row => {
    const key = (row[0] || "").trim();
    const val = (row[1] || "").trim();
    if (key) config[key] = val;
  });

  cached = config;
  return cached;
}
