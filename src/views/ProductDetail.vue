<template>
  <div class="container">
    <div class="product-detail">
      <div v-if="loading" class="center">Cargando producto…</div>
      <div v-else-if="error" class="center error">{{ error }}</div>
      <div v-else-if="product" class="content">

        <button class="back-btn" @click="router.back()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Volver
        </button>

        <div class="grid">
          <!-- IMAGEN -->
          <div class="media">
            <img
              v-if="product.image_key"
              :src="getProductImage(product)"
              :alt="product.product"
              class="product-image"
            />
            <div v-else class="empty-image">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="16" width="48" height="34" rx="4" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="22" cy="27" r="5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 40l13-9 11 8 9-6 14 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

          <!-- INFO -->
          <div class="info">
            <div class="header">
              <h1 class="title">{{ product.product }}</h1>
              <div class="price-row">
                <span class="price">${{ product.price }}</span>
                <span :class="['badge', product.stock === 0 ? 'out' : 'in']">
                  {{ product.stock === 0 ? 'Sin stock' : 'Disponible' }}
                </span>
              </div>
            </div>

            <p v-if="product.description" class="description">
              {{ product.description }}
            </p>

            <div v-if="product.stock != null" class="stock-info">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
              Stock disponible: <strong>{{ product.stock }}</strong> unidades
            </div>

            <div class="divider"></div>

            <!-- CONTROLES -->
            <div class="controls">
              <div class="qty">
                <button @click="decrease" :disabled="qty <= 1">−</button>
                <span class="qty-display">{{ qty }}</span>
                <button @click="increase">+</button>
              </div>

              <div class="actions">
                <button class="btn-cart" @click="addToCart" :disabled="product.stock === 0">
                  <i class="fa-solid fa-cart-plus"></i>
                  Añadir al carrito
                </button>
                <button class="btn-whatsapp" @click="whatsApp" :disabled="product.stock === 0">
                  <i class="fa-brands fa-whatsapp"></i>
                  Comprar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div v-else class="center">No hay producto seleccionado.</div>
      <div v-if="showToast" class="toast">
        <i class="fa-solid fa-check"></i>
        Producto añadido al carrito
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById } from '../services/products.js'
import { getProductImage } from '../services/products.js'
import emptyImg from "../assets/imgs/emptys/emptyImg.png"

const route = useRoute()
const router = useRouter()

const productId = route.params.id

const product = ref(null)
const loading = ref(false)
const error = ref(null)
const qty = ref(1)

const placeholderImage = '/assets/product-placeholder.png'

async function fetchProduct(id) {
    loading.value = true
    error.value = null
    try {
        const p = await getProductById(id)
        if (p) {
            product.value = p
        } else {
            error.value = 'Product not found.'
        }
    } catch (e) {
        error.value = 'Error loading product.'
        console.error(e)
    } finally {
        loading.value = false
    }
}
console.log(product)

function increase() {
    if (product.value?.stock != null && qty.value >= product.value.stock) return
    qty.value++
}
function decrease() {
    if (qty.value > 1) qty.value--
}

function addToCart() {
  if (!product.value) return

  const cartItem = {
    id: product.value.id,
    name: product.value.product,
    price: product.value.price,
    qty: qty.value,
    image: product.value.image
  }

  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []

    const existing = cart.find(i => i.id === cartItem.id)

    if (existing) {
      existing.qty = Math.min((product.value.stock ?? Infinity), existing.qty + cartItem.qty)
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    // 👇 GUARDAMOS EL TOAST
    localStorage.setItem('toast', JSON.stringify({
      message: `Se agregó ${qty.value} unidad(es) al carrito`,
      time: Date.now()
    }))

    // 👇 VOLVER ATRÁS
    router.push('/products')

  } catch (e) {
    console.error('Could not update cart', e)
  }
}

function whatsApp() {
    if (!product.value) return
    const message = `Hola, estoy interesado en el producto: ${product.value.product} (Cantidad: ${qty.value}).`
    const phoneNumber = '543446670475' // Replace with your business number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
}

onMounted(() => {
    if (productId) fetchProduct(productId)
})
watch(product, () => {
  console.log('PRODUCTO:', product.value)
  console.log('IMAGE_KEY:', product.value?.image_key)
})

const showToast = ref(false)

function triggerToast() {
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2500)
}
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.product-detail {
  background: #271f1a;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 10%;
  position: relative; /* 👈 CLAVE */
}

.back-btn {
  position: absolute;
  top: 20px;
  right: 20px;

  display: flex;
  align-items: center;
  gap: 6px;

  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: #c9a87c;

  transition: color 0.15s;
}

.back-btn:hover {
  color: #f5e6d0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}
@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
}

/* Imagen */
.media {
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1rem;
}
.empty-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #ccc;
}

/* Info */
.info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 22px;
  font-weight: 500;
  margin: 0 0 8px;
  color: #f5e6d0;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price {
  font-size: 26px;
  font-weight: 500;
  color: #f5e6d0;
  margin: 0;
}

.badge {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 12px;
  border-radius: 8px;
}
.badge.in {
  background: #1a3d2a;
  color: #4caf7d;
  border: 0.5px solid #2d6645;
}
.badge.out {
  background: #3d1a1a;
  color: #e07070;
  border: 0.5px solid #6d2d2d;
}

.description {
  font-size: 14px;
  color: #b08060;
  line-height: 1.65;
  margin: 0;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8a6040;
}
.stock-info strong {
  color: #c9a87c;
  font-weight: 500;
}

.divider {
  height: 0.5px;
  background: #5a3a1a;
}

/* Controles */
.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 0.5px solid #5a3a1a;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  background: #1e1108;
}
.qty button {
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #c9a87c;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.qty button:hover:not(:disabled) { background: #2e1a0a; }
.qty button:disabled { opacity: 0.3; cursor: not-allowed; }
.qty-display {
  width: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #f5e6d0;
  border-left: 0.5px solid #5a3a1a;
  border-right: 0.5px solid #5a3a1a;
  line-height: 36px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-cart,
.btn-whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}
.btn-cart:disabled,
.btn-whatsapp:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn-cart {
  background: #3d2010;
  color: #f5e6d0;
  border: 0.5px solid #7a5030;
}
.btn-cart:hover:not(:disabled) { background: #4d2a18; }

.btn-whatsapp {
  background: #1a3d2a;
  color: #4caf7d;
  border: 0.5px solid #2d6645;
}
.btn-whatsapp:hover:not(:disabled) { background: #214d35; }

.center {
  text-align: center;
  padding: 3rem;
  color: #8a6040;
}
.error { color: #e07070; }

/* TOAST */
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;

  background: #1a3d2a;
  color: #4caf7d;

  border: 1px solid #2d6645;
  border-radius: 10px;

  padding: 12px 18px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;

  box-shadow: 0 10px 25px rgba(0,0,0,0.3);

  animation: fadeInUp 0.3s ease;
  z-index: 999;
}

/* ANIMACIÓN */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>