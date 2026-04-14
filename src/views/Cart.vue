<template>
    <h1 class="cart-title">
      <i class="fa-solid fa-cart-shopping"></i> Mi carrito
    </h1>
  <div class="container">

    <section class="cart-view">

      <!-- Carrito vacío -->
      <div v-if="cart.length === 0" class="empty">
        <img :src="emptyCart" alt="Carrito vacío" />
        <p>Tu carrito está vacío</p>
        <router-link to="/" class="btn">Continuar comprando</router-link>
      </div>

      <!-- Carrito con productos -->
      <div v-else>
        <div class="item-row" v-for="item in cart" :key="item.id">

          <div class="thumb-box">
            <img v-if="item.image" :src="item.image" class="thumb" :alt="item.name" />
            <div v-else class="thumb-placeholder">
              <i class="fa-solid fa-wrench"></i>
            </div>
          </div>
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-sku" v-if="item.sku">{{ item.sku }}</span>
          </div>

          <div class="item-price">{{ formatCurrency(item.price) }}</div>

          <div class="qty">
            <button @click="decrease(item)">−</button>
            <span>{{ item.qty }}</span>
            <button @click="increase(item)">+</button>
          </div>

          <div class="item-subtotal">{{ formatCurrency(item.price * item.qty) }}</div>

          <button class="remove-btn" @click="removeItem(item.id)" title="Eliminar">
            <i class="fa-solid fa-xmark"></i>
          </button>

        </div>

        <!-- Resumen -->
        <div class="summary">
          <div class="summary-left">
            <button class="btn danger" @click="clearCart">Borrar todo</button>
            <router-link to="/" class="btn">Seguir comprando</router-link>
          </div>

          <div class="summary-right">
            <div class="totals">
              <span>Items: <strong>{{ totalItems }}</strong></span>
              <span>Total: <strong>{{ formatCurrency(totalPrice) }}</strong></span>
            </div>
            <button class="btn primary" @click="checkout">
              Realizar pedido
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Checkout Dialog -->
  <dialog ref="checkoutDialog" class="checkout-dialog">
  <div class="dialog-content">
    <h2>Completar pedido</h2>

    <form @submit.prevent>
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="form.firstName" placeholder="Juan" />
        </div>

        <div class="form-group">
          <label>Apellido</label>
          <input v-model="form.lastName" placeholder="Pérez" />
        </div>

        <div class="form-group full">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="juan@email.com" />
        </div>

        <div class="form-group">
          <label>Teléfono</label>
          <input v-model="form.phone" placeholder="+54 9…" />
        </div>

        <div class="form-group">
          <label>Dirección</label>
          <input v-model="form.address" placeholder="Calle 123, Ciudad" />
        </div>
      </div>

      <div class="dialog-actions">
        <button type="button" class="btn ghost" @click="closeDialog">
          Cancelar
        </button>

        <button
          type="button"
          class="btn whatsapp"
          :disabled="!isFormValid"
          @click="cargarWhatsApp"
        >
          WhatsApp
        </button>

        <button
          type="button"
          class="btn primary"
          :disabled="!isFormValid"
          @click="cargarMail"
        >
          Email
        </button>
      </div>
    </form>
  </div>
</dialog>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import emptyCart from '../assets/imgs/emptys/emptyCart.png'
import { getProductImage } from '../services/products'

const CART_KEY = 'cart'
const router = useRouter()

const checkoutDialog = ref(null)

const cart = ref([])

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
})

const isFormValid = computed(() => {
    return (
        form.value.firstName.trim() !== '' &&
        form.value.lastName.trim() !== '' &&
        form.value.email.trim() !== '' &&
        form.value.phone.trim() !== '' &&
        form.value.address.trim() !== '' 
    )
})

// Load cart from localStorage (or seed with an example for dev)
onMounted(() => {
    try {
        const raw = localStorage.getItem(CART_KEY)
        if (raw) {
            cart.value = JSON.parse(raw)
        } else {
            // Optional: uncomment to seed an example item during development
            // cart.value = [{ id: 'p1', name: 'Example Item', sku: 'EX-001', price: 19.99, qty: 2, image: '' }]
            cart.value = []
        }
    } catch {
        cart.value = []
    }
})

watch(
    cart,
    (newVal) => {
        localStorage.setItem(CART_KEY, JSON.stringify(newVal))
    },
    { deep: true }
)

const totalItems = computed(() => cart.value.reduce((s, i) => s + (Number(i.qty) || 0), 0))
const totalPrice = computed(() => cart.value.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0))

function formatCurrency(value) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'ARS' }).format(value || 0)
}

function increase(item) {
    item.qty = Number(item.qty || 0) + 1
}

function decrease(item) {
    const q = Number(item.qty || 0) - 1
    item.qty = q > 0 ? q : 1
}

function removeItem(id) {
    cart.value = cart.value.filter((i) => i.id !== id)
}

function clearCart() {
    cart.value = []
}

function checkout() {
    // Demo: open a native dialog; replace with your checkout flow integration
    if (typeof checkoutDialog.value?.showModal === 'function') {
        checkoutDialog.value.showModal()
    } else {
        // fallback: navigate to a checkout route if present
        router.push({ name: 'Checkout' }).catch(() => {})
    }
}

function closeDialog(e) {
    e?.preventDefault()
    checkoutDialog.value?.close()
}

function completeCheckout(e) {
    e?.preventDefault()
    // perform checkout actions (API calls, payment, etc.)
    // For demo purposes we clear the cart and close dialog
    clearCart()
    checkoutDialog.value?.close()
    router.push({ name: 'OrderConfirmation' }).catch(() => {})
}

// Función para enviar por WhatsApp
function cargarWhatsApp() {
   const productos = cart.value
    .map(item => `${item.name} x${item.qty} - ${formatCurrency(item.price * item.qty)}`)
    .join('\n')

  const message = 
`Pedido de ${form.value.firstName} ${form.value.lastName}
Email: ${form.value.email}
Teléfono: ${form.value.phone}
Dirección: ${form.value.address}
Productos:
${productos}

Total: ${formatCurrency(totalPrice.value)}
`
  const phoneNumber = '5493446670475' // reemplaza con tu número
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

// Función para enviar por Gmail
function cargarMail() {
  const productos = cart.value
    .map(item => `${item.name} x${item.qty} - ${formatCurrency(item.price * item.qty)}`)
    .join('\n')

  const subject = 'Nuevo pedido'

  const body = 
`Pedido de ${form.value.firstName} ${form.value.lastName}
Email: ${form.value.email}
Teléfono: ${form.value.phone}
Dirección: ${form.value.address}

Productos:
${productos}

Total: ${formatCurrency(totalPrice.value)}`.trim()

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=elmoroferreteria@gmail.com` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`

  window.open(gmailUrl, '_blank')
}

</script>

<style scoped>
/* sin :root */

.container {
  max-width: 1100px;
  margin: auto;
  padding: 2rem 1rem 4rem;
}

.cart-title {
  display: flex;
  align-items: center;
  gap: .75rem;
  font-size: clamp(1.6rem, 4vw, 2.3rem);
  color: #f4f4f4;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.cart-view {
  background: linear-gradient(160deg, #4b2c07, #723e11);
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow:
    0 10px 30px rgba(0,0,0,.25),
    inset 0 1px 0 rgba(255,255,255,.05);
}

.empty {
  text-align: center;
  padding: 3rem 1rem;
}

.empty img {
  width: 160px;
  max-width: 100%;
  margin-bottom: 1rem;
}

.item-row {
  display: grid;
  grid-template-columns: 70px 1fr 120px auto 130px 42px;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.thumb-box {
  width: 70px;
  height: 70px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255,255,255,.04);
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #e8a94a;
  font-size: 1.4rem;
}

.item-name {
  display: block;
  font-weight: 700;
}

.item-sku {
  display: block;
  font-size: .8rem;
  opacity: .65;
  margin-top: .25rem;
}

.item-price,
.item-subtotal {
  font-weight: 700;
}

.item-subtotal {
  color: #e8a94a;
  text-align: right;
}

.qty {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.qty button {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: rgba(255,255,255,.08);
  color: white;
  cursor: pointer;
}

.qty button:hover {
  background: rgba(255,255,255,.18);
}

.remove-btn {
  border: none;
  background: transparent;
  color: #ff6b6b;
  cursor: pointer;
  opacity: .75;
}

.remove-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.summary {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.summary-left,
.summary-right {
  display: flex;
  gap: .75rem;
  flex-wrap: wrap;
  align-items: center;
}

.summary-right {
  margin-left: auto;
}

.totals {
  background: rgba(255,255,255,.05);
  border-radius: 12px;
  padding: .8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: .35rem;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: .8rem 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  background: #ececec;
  color: #111;
}

.btn.primary {
  background: #0078d4;
  color: white;
}

.btn.danger {
  background: #ffe1e1;
  color: #a61d1d;
}

.btn.ghost {
  background: transparent;
  border: 1px solid rgba(255,255,255,.18);
  color: white;
}

.btn.whatsapp {
  background: #25D366;
  color: white;
}

.checkout-dialog {
  border: none;
  border-radius: 18px;
  overflow: hidden;
  background: transparent;
}

.dialog-content {
  background: linear-gradient(160deg, #24236e, #12186b);
  color: white;
  padding: 2rem;
  width: min(92vw, 560px);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group input {
  padding: .85rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(0,0,0,.25);
  color: white;
}

.dialog-actions {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: .75rem;
  margin-top: 1.5rem;
}

@media (max-width: 850px) {
  .item-row {
    grid-template-columns: 60px 1fr;
    padding: 1rem;
    background: rgba(255,255,255,.04);
    border-radius: 14px;
    margin-bottom: .8rem;
  }

  .item-price,
  .qty,
  .item-subtotal,
  .remove-btn {
    grid-column: 2;
  }

  .item-subtotal {
    text-align: left;
  }

  .summary,
  .summary-left,
  .summary-right {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 560px) {
  .form-grid,
  .dialog-actions {
    grid-template-columns: 1fr;
  }

  .dialog-content {
    padding: 1.25rem;
  }
}
</style>