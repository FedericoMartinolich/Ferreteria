const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIpBQq-bOHuBjvQDnIKcu0dKs9R6eqWqNsBCyVdheJcdU7rQkVNUHV_4BKNo7kGYIlJw-XVZLDadW_/pub?output=csv";

async function fetchEvents() {
  const res = await fetch(URL);
  const csv = await res.text();

  const rows = csv.trim().split("\n").map(r => r.split(","));
  const headers = rows.shift();

  return rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = row[i]?.trim() || "";
    });

    return {
      ...obj,
      active: obj.active === "1",
      product_ids: obj.product_ids?.split("|") || []
    };
  });
}

/* 🔹 Helper reutilizable */
async function getEventByKey(eventKey) {
  const events = await fetchEvents();
  return events.filter(
    event => event.active && event.event_key === eventKey
  );
}

/* 🔹 Funciones públicas */
export const getChristmasEvent = () => getEventByKey("christmas");
export const getNewProductsEvent = () => getEventByKey("new");
export const getSpecialOffersEvent = () => getEventByKey("offers");