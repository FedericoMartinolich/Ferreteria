<template>
    <div class="product-detail">
        <div v-if="loading" class="center">Loading product…</div>
        <div v-else-if="error" class="center error">{{ error }}</div>
        <div v-else-if="product" class="content">
            <div class="media">
                <img :src="product.image || placeholderImage" :alt="product.name" />
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById } from '../services/products.js'

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
</script>

<style scoped>
.product-detail {
    max-width: 960px;
    margin: 24px auto;
    padding: 16px;
    box-sizing: border-box;
    background-color: var(--moro);
    border-radius: 8px;
}
.back-btn {
    background: var(--llave);
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px 14px;
    margin-bottom: 12px;
    border-radius: 6px;
}
.content {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}
.media {
    flex: 1 1 320px;
    max-width: 360px;
}
.media img {
    width: 100%;
    height: auto;
    border-radius: 6px;
    object-fit: cover;
    background: #f3f4f6;
}
.info {
    flex: 1 1 420px;
}
.title {
    margin: 0 0 8px;
    margin-top: 18px;
    font-size: 1.5rem;
}
.price {
    font-size: 1.25rem;
    /* color: #1a202c; */
    margin: 8px 0;
}
.description {
    color: #4a5568;
    margin: 12px 0;
}
.controls {
    margin-top: 18px;
    margin-left: 18px;
    margin-right: 18px;
    margin-bottom: 18px;
    display: flex;
    gap: 12px;
    align-items: center;
}
.qty {
    display: flex;
    gap: 8px;
    align-items: center;
}
.qty button {
    width: 36px;
    height: 36px;
}
.qty input {
    width: 64px;
    text-align: center;
    padding: 6px;
}
.add {
    background: var(--llave);
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
}
.add:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.whatsApp {
    background: #1b9b4a;
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
}
button {
    white-space: nowrap;
}
.center {
    text-align: center;
    padding: 24px 0;
}
.error {
    color: #c53030;
}
</style>