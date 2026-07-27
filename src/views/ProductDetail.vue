<template>
  <div class="pd-page">
    <!-- Loading / Error -->
    <div v-if="loading" class="center">
      <div class="spinner"></div>
      <p>Cargando producto…</p>
    </div>
    <div v-else-if="error" class="center error">{{ error }}</div>

    <template v-else-if="product">
      <!-- BOTÓN VOLVER -->
      <button class="back-btn" @click="router.back()">
        <i class="fa-solid fa-arrow-left"></i>
        Volver al catálogo
      </button>

      <div class="product-card">
        <!-- IMAGEN -->
        <div class="media">
          <div v-if="product.badge" class="img-badge">{{ product.badge }}</div>
          <img
            v-if="product.image_key"
            :src="getProductImage(product)"
            :alt="product.product"
            class="product-image"
          />
          <div v-else class="empty-image">
            <i class="fa-solid fa-image"></i>
          </div>
        </div>

        <!-- CONTENIDO -->
        <div class="content">
          <!-- BLOQUE INFO -->
          <div class="info-block">
            <div class="top-row">
              <div class="category" v-if="product.category">
                {{ product.category }}
              </div>
              <div class="price-row">
                <span class="price">${{ formatPrice(product.price) }}</span>
                <span :class="['badge', product.stock === 0 ? 'out' : 'in']">
                  <i
                    :class="
                      product.stock === 0
                        ? 'fa-solid fa-xmark'
                        : 'fa-solid fa-check'
                    "
                  ></i>
                  {{ product.stock === 0 ? "Sin stock" : "Disponible" }}
                </span>
              </div>
            </div>

            <h1 class="title">{{ product.product }}</h1>

            <p v-if="product.description" class="description">
              {{ product.description }}
            </p>

            <!-- FEATURES -->
            <div v-if="product.features?.length" class="specs-box">
              <h3 class="specs-title">
                <i class="fa-solid fa-list-check"></i> Características Técnicas
              </h3>
              <ul class="specs-list">
                <li v-for="(f, i) in product.features" :key="i">
                  <i class="fa-solid fa-circle-check"></i> {{ f }}
                </li>
              </ul>
            </div>
          </div>

          <div class="divider"></div>

          <!-- BLOQUE CONTROLES -->
          <div class="controls-block">
            <!-- Stock -->
            <div v-if="product.stock != null" class="stock-info">
              <i class="fa-solid fa-boxes-stacked"></i>
              <span
                >Stock: <strong>{{ product.stock }}</strong> unidades</span
              >
            </div>

            <!-- Cantidad + Botones -->
            <div class="purchase-row">
              <div class="qty">
                <button class="qty-btn" @click="decrease" :disabled="qty <= 1">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="qty-display">{{ qty }}</span>
                <button
                  class="qty-btn"
                  @click="increase"
                  :disabled="product.stock && qty >= product.stock"
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>

              <div class="actions">
                <button
                  class="btn-cart"
                  @click="addToCart"
                  :disabled="product.stock === 0"
                >
                  <i class="fa-solid fa-cart-plus"></i>
                  Añadir al carrito
                </button>
                <button
                  class="btn-whatsapp"
                  @click="whatsApp"
                  :disabled="product.stock === 0"
                >
                  <i class="fa-brands fa-whatsapp"></i>
                  Consultar por WhatsApp
                </button>
              </div>
            </div>

            <!-- TRUST -->
            <div class="trust-row">
              <div class="trust-item">
                <i class="fa-solid fa-truck-fast"></i>
                <span>Envíos a todo el país</span>
              </div>
              <div class="trust-item">
                <i class="fa-solid fa-shield-halved"></i>
                <span>Compra segura</span>
              </div>
              <div class="trust-item">
                <i class="fa-solid fa-headset"></i>
                <span>Atención personalizada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="center">No hay producto seleccionado.</div>

    <!-- TOAST -->
    <div v-if="showToast" class="toast">
      <i class="fa-solid fa-check-circle"></i>
      <span>Producto añadido al carrito</span>
    </div>

    <ConfirmModal
      v-model="showAddConfirm"
      message="¿Desea agregar este producto al carrito?"
      @confirm="confirmAddToCart"
      @cancel="showAddConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProductById } from "../services/products.js";
import { getProductImage } from "../services/products.js";
import { useConfig } from "../composables/useConfig.js";
import emptyImg from "../assets/imgs/emptys/emptyImg.png";
import ConfirmModal from "../components/ConfirmModal.vue";

const route = useRoute();
const router = useRouter();
const { load: loadConfig, whatsapp } = useConfig();

const productId = route.params.id;

const product = ref(null);
const loading = ref(false);
const error = ref(null);
const qty = ref(1);

const placeholderImage = "/assets/product-placeholder.png";

async function fetchProduct(id) {
  loading.value = true;
  error.value = null;
  try {
    const p = await getProductById(id);
    if (p) {
      product.value = p;
    } else {
      error.value = "Product not found.";
    }
  } catch (e) {
    error.value = "Error loading product.";
  } finally {
    loading.value = false;
  }
}
/* console.log(product) */

function increase() {
  if (product.value?.stock != null && qty.value >= product.value.stock) return;
  qty.value++;
}
function decrease() {
  if (qty.value > 1) qty.value--;
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-AR").format(value || 0);
}

const showAddConfirm = ref(false);

function addToCart() {
  if (!product.value) return;
  showAddConfirm.value = true;
}

function confirmAddToCart() {
  showAddConfirm.value = false;

  const cartItem = {
    id: product.value.id,
    name: product.value.product,
    price: product.value.price,
    qty: qty.value,
    image: product.value.image_key ? getProductImage(product.value) : null,
  };

  try {
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];

    const existing = cart.find((i) => i.id === cartItem.id);

    if (existing) {
      existing.qty = Math.min(
        product.value.stock ?? Infinity,
        existing.qty + cartItem.qty,
      );
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    // 👇 GUARDAMOS EL TOAST
    localStorage.setItem(
      "toast",
      JSON.stringify({
        message: `Se agregó ${qty.value} unidad(es) al carrito`,
        time: Date.now(),
      }),
    );

    // 👇 VOLVER ATRÁS
    router.push("/products");
  } catch (e) {
    /* console.error('Error adding to cart:', e) */
  }
}

function whatsApp() {
  if (!product.value) return;
  const message = `Hola, estoy interesado en el producto: ${product.value.product} (Cantidad: ${qty.value}).`;
  const url = `https://wa.me/${whatsapp.value}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

onMounted(async () => {
  await loadConfig();
  if (productId) fetchProduct(productId);
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchProduct(newId);
    }
  },
);

const showToast = ref(false);

function triggerToast() {
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2500);
}
</script>

<style scoped>
/* ===========================
   PAGE
   =========================== */
.pd-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
}

/* ===========================
   BACK BUTTON
   =========================== */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--gray-400);
  margin-bottom: 1.25rem;
  padding: 0;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: var(--orange);
}

/* ===========================
   PRODUCT CARD
   =========================== */
.product-card {
  background: var(--white);
  border-radius: 20px;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 2.5rem;
  align-items: stretch;
  flex: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

/* ===========================
   MEDIA / IMAGE
   =========================== */
.media {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: var(--gray-50);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--gray-200);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5rem;
  transition: transform 0.4s ease;
}

.media:hover .product-image {
  transform: scale(1.03);
}

.img-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--orange);
  color: var(--white);
  padding: 5px 12px;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 999px;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.empty-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--gray-400);
  font-size: 3rem;
}

/* ===========================
   CONTENT
   =========================== */
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

/* ===========================
   INFO
   =========================== */

.top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.category {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--orange);
  padding-top: 6px;
}

.title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  color: var(--navy);
  line-height: 1.3;
  text-align: left;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #b91c1c;
  margin: 0;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}

.badge.in {
  background: #16a34a;
  color: var(--white);
  border: none;
}

.badge.out {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.2);
}

.description {
  font-size: 0.9rem;
  color: var(--gray-600);
  line-height: 1.7;
  margin: 0;
  text-align: left;
}

/* ===========================
   SPECS BOX
   =========================== */
.specs-box {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 1rem 1.25rem;
}

.specs-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--navy);
  margin: 0 0 0.6rem 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.specs-title i {
  color: var(--orange);
  font-size: 0.75rem;
}

.specs-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.specs-list li {
  font-size: 0.8rem;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  gap: 8px;
}

.specs-list li i {
  color: var(--orange);
  font-size: 0.7rem;
  flex-shrink: 0;
}

/* ===========================
   STOCK
   =========================== */
.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--gray-400);
}

.stock-info i {
  color: var(--orange);
  font-size: 0.75rem;
}

.stock-info strong {
  color: var(--navy);
  font-weight: 700;
}

/* ===========================
   DIVIDER
   =========================== */
.divider {
  height: 1px;
  background: var(--gray-200);
  margin: 0.5rem 0;
}

/* ===========================
   CONTROLS
   =========================== */
.controls-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.purchase-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.qty {
  display: inline-flex;
  align-items: center;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
  width: fit-content;
}

.qty-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--orange);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: background 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: var(--gray-100);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-display {
  width: 48px;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: var(--navy);
  border-left: 1px solid var(--gray-200);
  border-right: 1px solid var(--gray-200);
  line-height: 40px;
}

/* ===========================
   ACTIONS
   =========================== */
.actions {
  display: flex;
  gap: 0.75rem;
}

.btn-cart,
.btn-whatsapp {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cart:disabled,
.btn-whatsapp:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn-cart {
  background: var(--navy);
  color: var(--white);
}

.btn-cart:hover:not(:disabled) {
  transform: translateY(-2px);
  background: var(--orange);
}

.btn-whatsapp {
  background: #25d366;
  color: #fff;
}

.btn-whatsapp:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #20bd5a;
}

/* ===========================
   TRUST ROW
   =========================== */
.trust-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  padding-top: 0.5rem;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: var(--gray-400);
}

.trust-item i {
  color: var(--orange);
  font-size: 0.75rem;
}

/* ===========================
   CENTER / LOADING / ERROR
   =========================== */
.center {
  text-align: center;
  padding: 5rem 1rem;
  color: var(--gray-400);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error {
  color: #dc3545;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--orange);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===========================
   TOAST
   =========================== */
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: var(--navy);
  color: var(--white);
  border: 1px solid var(--navy-light);
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  animation: fadeInUp 0.3s ease;
  z-index: 999;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===========================
   RESPONSIVE TABLET — stacked
   =========================== */
@media (max-width: 900px) {
  .pd-page {
    padding: 1.5rem 1rem;
    min-height: auto;
    justify-content: flex-start;
  }

  .product-card {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 1.5rem;
    flex: none;
  }

  .media {
    margin: -1.5rem -1.5rem 1.5rem -1.5rem;
    border-radius: 20px 20px 0 0;
    aspect-ratio: 2 / 1;
    height: auto;
  }

  .content {
    gap: 1.25rem;
  }

  .info-block {
    align-items: flex-start;
  }

  .purchase-row {
    flex-wrap: wrap;
  }

  .actions {
    flex: 1;
  }

  .trust-row {
    justify-content: center;
    gap: 1.2rem;
  }
}

/* ===========================
   RESPONSIVE MOBILE
   =========================== */
@media (max-width: 640px) {
  .pd-page {
    padding: 1rem 0.75rem;
  }

  .back-btn {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .product-card {
    padding: 0;
    border-radius: 16px;
    overflow: hidden;
    flex: none;
  }

  .media {
    margin: 0;
    border-radius: 0;
    aspect-ratio: 4 / 3;
  }

  .product-image {
    padding: 1rem;
  }

  .content {
    padding: 1.25rem;
    gap: 1rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .price {
    font-size: 1.5rem;
  }

  .badge {
    font-size: 0.7rem;
    padding: 3px 8px;
  }

  .description {
    font-size: 0.85rem;
  }

  .specs-list li {
    font-size: 0.75rem;
  }

  .stock-info {
    font-size: 0.75rem;
  }

  .purchase-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .qty {
    width: 100%;
    justify-content: center;
  }

  .actions {
    flex-direction: column;
  }

  .btn-cart,
  .btn-whatsapp {
    width: 100%;
    padding: 13px 16px;
    font-size: 0.85rem;
  }

  .trust-item {
    font-size: 0.65rem;
  }

  .toast {
    right: 50%;
    transform: translateX(50%);
    bottom: 16px;
    width: 92%;
    justify-content: center;
    font-size: 0.85rem;
    padding: 12px 16px;
  }
}
</style>
