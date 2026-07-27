import Papa from "papaparse";

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSs5bfyJBAq7emwrDrLQXOKo05WstZWhbLw-z6-SVshrB4Te_rAlNmX21G9K9LcNBjgwitUSkEniVEG/pub?output=csv";

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
