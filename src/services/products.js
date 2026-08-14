const BASE = import.meta.env.VITE_SHEET_BASE_URL;
const GID = import.meta.env.VITE_PRODUCTS_GID;
const url = GID ? `${BASE}&gid=${GID}` : BASE;

import Papa from "papaparse";
import emptyImg from "../assets/imgs/emptys/emptyImg.png";

export async function getProducts() {
  const res = await fetch(url);
  const csv = await res.text();

  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  const products = data.map(product => {
    const price = Number(product.price);
    const originalPrice = Number(product.originalPrice);

    if (originalPrice && price) {
      product.discount = (
        (originalPrice - price) /
        originalPrice
      ) * 100;
    } else {
      product.discount = 0;
    }

    return product;
  });

  return products;
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

export function getProductImage(product) {
  if (!product.image_key) {
    return emptyImg
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_400,q_auto/${product.image_key}`
}