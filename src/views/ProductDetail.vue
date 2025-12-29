<template>
<div class="container">
        <div class="product-detail">
            <div v-if="loading" class="center">Loading product…</div>
            <div v-else-if="error" class="center error">{{ error }}</div>
            <div v-else-if="product" class="content">
                <div class="media">
                <img
                v-if="product.image_key"
                :src="getProductImage(product)"
                    :alt="product.product"
                    loading="lazy"
                    class="product-image"
                    />

                    <img v-else :src=emptyImg alt="">
                </div>
                
                <div class="info">
                    <button class="back-btn" @click="router.back()" style="float: right;">← Back</button>
                    <h1 class="title">{{ product.product }}</h1>
                    <!-- <p class="sku" v-if="product.sku">SKU: {{ product.sku }}</p> -->
                    <p class="price">${{ product.price }}</p>
                    
                <p class="description" v-if="product.description">{{ product.description }}</p>

                <div class="controls">
                    <div class="qty">
                        <button @click="decrease" :disabled="qty <= 1">−</button>
                        <input type="number" v-model.number="qty" min="1" />
                        <button @click="increase">+</button>
                        <span class="stock" v-if="product.stock != null">({{ product.stock }} in stock)</span>
                    </div>
                    
                    <button
                    class="add"
                        @click="addToCart"
                        :disabled="product.stock === 0"
                        >
                        <i class="fa-solid fa-cart-plus"></i> Añadir al carrito
                    </button>
                    <button
                    class="whatsApp"
                    @click="whatsApp"
                    :disabled="product.stock === 0"
                    >
                        <i class="fa-brands fa-whatsapp"></i> Pedir por WhatsApp 
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

<style scoped>
/* =========================
   ESTILO GENERAL
   ========================= */

.container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.product-detail {
  max-width: 960px;
  margin: 32px auto;
  padding: 24px;
  box-sizing: border-box;
  background: #f6f1ea; /* crema cálido */
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(62, 39, 20, 0.25);
}

/* =========================
   CONTENIDO
   ========================= */

.content {
  display: flex;
  gap: 28px;
  align-items: center;
}

/* =========================
   IMAGEN
   ========================= */

.media {
  flex: 1 1 320px;
  max-width: 360px;
}

.media img {
  width: 100%;
  height: auto;
  border-radius: 14px;
  object-fit: cover;
  background: #efe6dc;
  box-shadow: 0 8px 20px rgba(60, 40, 25, 0.25);
}

/* =========================
   INFO
   ========================= */

.info {
  flex: 1 1 420px;
}

/* =========================
   BOTÓN VOLVER
   ========================= */

.back-btn {
  background: transparent;
  border: 1px solid #6b5b4b;
  color: #3b2a1a;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  float: right;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* =========================
   TEXTO
   ========================= */

.title {
  margin: 16px 0 6px;
  font-size: 1.6rem;
  font-weight: 600;
  color: #3b2a1a;
}

.price {
  font-size: 1.35rem;
  font-weight: 600;
  color: #6b8e23; /* verde oliva */
  margin: 8px 0 14px;
}

.description {
  color: #6b5b4b;
  line-height: 1.55;
  font-size: 0.95rem;
}

/* =========================
   CONTROLES
   ========================= */

.controls {
  margin-top: 20px;
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}

/* =========================
   CANTIDAD
   ========================= */

.qty {
  display: flex;
  gap: 8px;
  align-items: center;
}

.qty button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #8b8b8b;
  background: #7c7c7c;
  cursor: pointer;
}

.qty input {
  width: 64px;
  text-align: center;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #c8b8a8;
}

.stock {
  font-size: 0.85rem;
  color: #6b5b4b;
}

/* =========================
   BOTÓN CARRITO
   ========================= */

.add {
  background: #6b8e23; /* verde oliva */
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease, transform 0.1s ease;
}

.add:hover {
  background: #556b2f;
  transform: translateY(-1px);
}

.add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* =========================
   BOTÓN WHATSAPP
   ========================= */

.whatsApp {
  background: #1b9b4a;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease, transform 0.1s ease;
}

.whatsApp:hover {
  background: #14833e;
  transform: translateY(-1px);
}

/* =========================
   UTILIDADES
   ========================= */

button {
  white-space: nowrap;
}

.center {
  text-align: center;
  padding: 24px 0;
}

.error {
  color: #a33232;
}

/* =========================
   RESPONSIVE
   ========================= */

@media (max-width: 768px) {
  .product-detail {
    padding: 18px;
    margin: 16px 12px;
  }

  .content {
    flex-direction: column;
    gap: 18px;
  }

  .media {
    max-width: 100%;
  }

  .info {
    width: 100%;
  }

  .back-btn {
    float: none;
    width: 100%;
    margin-bottom: 14px;
    text-align: center;
  }

  .title,
  .price,
  .description {
    text-align: center;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }

  .qty {
    justify-content: center;
  }

  .add,
  .whatsApp {
    width: 100%;
    justify-content: center;
  }
}

</style>