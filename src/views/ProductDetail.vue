<template>
  <div class="container">
    <div class="product-detail">

      <div v-if="loading" class="center">Cargando producto…</div>
      <div v-else-if="error" class="center error">{{ error }}</div>

      <div v-else-if="product" class="content">

        <!-- IMAGEN -->
        <div class="media">
          <img
            v-if="product.image_key"
            :src="getProductImage(product)"
            :alt="product.product"
            class="product-image"
          />
          <img v-else :src="emptyImg" class="product-image empty" />
        </div>

        <!-- INFO -->
        <div class="info">

          <div class="top-bar">
            <button class="back-btn" @click="router.back()">← Volver</button>
          </div>

          <h1 class="title">{{ product.product }}</h1>

          <div class="price-row">
            <p class="price">${{ product.price }}</p>
            <span v-if="product.stock === 0" class="badge out">Sin stock</span>
            <span v-else class="badge in">Disponible</span>
          </div>

          <p v-if="product.description" class="description">
            {{ product.description }}
          </p>

          <div class="divider"></div>

          <!-- STOCK -->
          <p class="stock" v-if="product.stock != null">
            Stock: <strong>{{ product.stock }}</strong>
          </p>

          <!-- CONTROLES -->
          <div class="controls">

            <div class="qty">
              <button @click="decrease" :disabled="qty <= 1">−</button>
              <input type="number" v-model.number="qty" min="1" />
              <button @click="increase">+</button>
            </div>

            <button
              class="add"
              @click="addToCart"
              :disabled="product.stock === 0"
            >
              <i class="fa-solid fa-cart-plus"></i>
              Añadir al carrito
            </button>

            <button
              class="whatsapp"
              @click="whatsApp"
              :disabled="product.stock === 0"
            >
              <i class="fa-brands fa-whatsapp"></i>
              Comprar por WhatsApp
            </button>

          </div>

        </div>
      </div>

      <div v-else class="center">No product selected.</div>
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

    // Simple localStorage cart implementation (replace with Vuex/Pinia or backend call)
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
        // Optional feedback
        window.alert('Added to cart')
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
</script>

<style scoped>/* ===== CONTENEDOR ===== */
/* ===== CONTENEDOR ===== */
.container {
  display: block;
  justify-content: center;
  padding: 40px 20px;
}

/* ===== CARD ===== */
.product-detail {
  width: 100%;
  /* max-width: ; */
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  padding: 32px;
  transition: 0.3s;
}

/* ===== LAYOUT ===== */
.content {
  display: flex;
  gap: 50px;
  align-items: flex-start;
}

/* ===== IMAGEN ===== */
.media {
  flex: 1;
  max-width: 450px;
}

.product-image {
  width: 100%;
  border-radius: 18px;
  object-fit: cover;
  background: #f1f1f1;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.02);
}

.product-image.empty {
  opacity: 0.5;
}

/* ===== INFO ===== */
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ===== TOP ===== */
.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

/* ===== BACK ===== */
.back-btn {
  border: none;
  background: #f1f3f5;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
  color: #374151;
}

.back-btn:hover {
  background: #e2e6ea;
  color: #1f2937;
}

/* ===== TEXT ===== */
.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 10px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #16a34a;
}

/* ===== BADGES ===== */
.badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.badge.in {
  background: #dcfce7;
  color: #15803d;
}

.badge.out {
  background: #fee2e2;
  color: #b91c1c;
}

/* ===== DESCRIPTION ===== */
.description {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 18px;
  font-size: 1rem;
}

/* ===== DIVIDER ===== */
.divider {
  height: 1px;
  background: #eee;
  margin: 16px 0;
}

/* ===== STOCK ===== */
.stock {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 20px;
}

/* ===== CONTROLES ===== */
.controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ===== QTY ===== */
.qty {
  display: flex;
  align-items: center;
  justify-content:center;
  text-align: center;
  gap: 10px;
}

.qty button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: #7a7a7a;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 0%;
}

.qty button:hover {
  background: #727272;
}

.qty input {
  width: 70px;
  height: 25px;
  text-align: center;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

/* ===== BOTONES ===== */
.add,
.whatsapp {
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.25s ease;
}

/* carrito */
.add {
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: white;
  box-shadow: 0 10px 20px rgba(34,197,94,0.25);
}

.add:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px rgba(34,197,94,0.35);
}

/* whatsapp */
.whatsapp {
  background: linear-gradient(135deg, #25d366, #1ebe5d);
  color: white;
}

.whatsapp:hover {
  transform: translateY(-2px);
}

/* disabled */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* ===== UTIL ===== */
.center {
  text-align: center;
  padding: 40px;
}

.error {
  color: red;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .content {
    display:block;
    flex-direction: column;
    gap: 25px;
  }

  .media {
    max-width: 100%;
  }

  .title,
  .price,
  .description,
  .stock {
    text-align: center;
  }

  .price-row {
    justify-content: center;
  }

  .top-bar {
    justify-content: center;
  }
}
</style>