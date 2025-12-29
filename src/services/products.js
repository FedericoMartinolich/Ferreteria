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
  if (!product.image_key) {
    return '/img/placeholder.png'
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_400,q_auto/${product.image_key}`
}