const url = `
  https://docs.google.com/spreadsheets/d/e/2PACX-1vTj8ske2PVx3Xrzxpw0rgQBlDxY_MTtAOjh4KU5waKgcizdypRMiyYRFt12p8AM6g2RG_xcxKpQ9M2o/pub?output=csv
`;
import Papa from "papaparse";

export async function getProducts() {
  const res = await fetch(url);
  const csv = await res.text();

  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return data;
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

export function getProductImage(product) {
  const key = product.image_key?.trim();

  if (!key) {
    return '/img/placeholder.png';
  }

  return `https://res.cloudinary.com/dehd0hw2a/image/upload/w_400,q_auto/${key}`;
}