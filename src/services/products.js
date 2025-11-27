export async function getProducts() {
  const url = `
    https://docs.google.com/spreadsheets/d/e/2PACX-1vTj8ske2PVx3Xrzxpw0rgQBlDxY_MTtAOjh4KU5waKgcizdypRMiyYRFt12p8AM6g2RG_xcxKpQ9M2o/pub?output=csv
  `;

  const res = await fetch(url);
  const csv = await res.text();

  // convertir CSV a array de objetos
  const rows = csv.trim().split("\n").map(r => r.split(","));

  const headers = rows.shift(); // primera fila

  const data = rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = row[i] ? row[i].trim() : "";
    });
    return obj;
  });

  return data;
}
