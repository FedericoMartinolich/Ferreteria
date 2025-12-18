export async function getEvents() {
    const url = `
        https://docs.google.com/spreadsheets/d/e/2PACX-1vQIpBQq-bOHuBjvQDnIKcu0dKs9R6eqWqNsBCyVdheJcdU7rQkVNUHV_4BKNo7kGYIlJw-XVZLDadW_/pub?output=csv
    `;

    const res = await fetch(url);
    const csv = await res.text();

    const rows = csv.trim().split("\n").map(r => r.split(","));
    const headers = rows.shift();

    const data = rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = row[i] ? row[i].trim() : "";
        });
        return obj;
    });

    return data
}