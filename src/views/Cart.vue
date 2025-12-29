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
        <table class="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th class="center">Precio</th>
              <th class="center">Cantidad</th>
              <th class="center">Subtotal</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in cart" :key="item.id">
              <td data-label="Producto" class="product-cell">
                <img v-if="item.image" :src="item.image" class="thumb" />
                <span class="name">{{ item.name }}</span>
              </td>

              <td class="center" data-label="Precio">
                {{ formatCurrency(item.price) }}
              </td>

              <td class="center" data-label="Cantidad">
                <div class="qty">
                  <button @click="decrease(item)">−</button>
                  <input type="number" v-model.number="item.qty" min="1" />
                  <button @click="increase(item)">+</button>
                </div>
              </td>

              <td class="center" data-label="Subtotal">
                {{ formatCurrency(item.price * item.qty) }}
              </td>

              <td class="actions" data-label="Acciones">
                <button class="remove" @click="removeItem(item.id)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

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
      <h2>Completar Pedido</h2>
      <form @submit="completeCheckout">
        <div class="form-group">
          <label>Nombre:</label>
          <input v-model="form.firstName" type="text" required />
        </div>
        <div class="form-group">
          <label>Apellido:</label>
          <input v-model="form.lastName" type="text" required />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="form.email" type="email" required />
        </div>
        <div class="form-group">
          <label>Teléfono:</label>
          <input v-model="form.phone" type="tel" required />
        </div>
        <div class="form-group">
          <label>Dirección:</label>
          <input v-model="form.address" type="text" required />
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn" @click="closeDialog">Cancelar</button>
          <button type="button" class="btn whatsapp" @click="cargarWhatsApp" :disabled="!isFormValid">Enviar por WhatsApp</button>
          <button type="button" class="btn primary" @click="cargarMail" :disabled="!isFormValid">Enviar por Email</button>
        </div>
      </form>
    </div>
  </dialog>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import emptyCart from '../assets/imgs/emptys/emptyCart.png'

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
.whatsapp {
  background-color: #25D366 !important;
  color: white;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cart-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 2rem;
  color: rgb(226, 226, 226);
  margin-bottom: 1.5rem;
  margin: 2rem;
}

.cart-view {
  background: var(--moro);
  color: #fff;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 15px 35px rgba(0,0,0,.35);
}

/* EMPTY */
.empty {
  text-align: center;
  padding: 3rem 0;
}

.empty img {
  width: 140px;
  margin-bottom: 1rem;
}

/* TABLE DESKTOP */
.cart-table {
  width: 100%;
  border-collapse: collapse;
}

.cart-table th {
  background: rgba(0,0,0,.25);
  padding: 12px;
  font-weight: 600;
}

.cart-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(255,255,255,.15);
}

.center {
  text-align: center;
}

/* PRODUCT */
.product-cell {
  align-items: center;
  gap: 10px;
}

.thumb {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.name {
  font-weight: 600;
}

/* QTY */
.qty {
  display: flex;
  align-items: center;
  gap: 6px;
}

.qty button {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  background: #222;
  color: #fff;
  border: none;
  cursor: pointer;
}

.qty input {
  width: 50px;
  text-align: center;
}

/* ACTIONS */
.remove {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
}

/* SUMMARY */
.summary {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 1.5rem;
}

.summary-left,
.summary-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.summary-right {
  flex-direction: column;
  align-items: flex-end;
}

.totals {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* BUTTONS */
.btn {
    display: inline-block;
    padding: 8px 14px;
    background: #ededed;
    border-radius: 6px;
    border: 1px solid #583b036b;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    background-color: var(--llave);
}

.btn.primary {
  background: #0078d4;
  color: #fff;
}

.btn.danger {
  background: #ffecec;
  color: #b03030;
}

/* ================= MOBILE IMPROVEMENTS ================= */
@media (max-width: 800px) {
    .container {
        max-width: 100%;
        padding: 1rem;
        flex-direction: column;
    }

    .cart-title {
        font-size: 1.8rem;
        margin: 1rem 0;
    }

    .cart-view {
        padding: 1rem;
    }
}

@media (max-width: 800px) {
    .container {
        transform: scale(0.8);
    } 
    
}

@media (max-width: 600px) {

    .container {
        transform: scale(1);
        display: grid;
        justify-content: center;
        align-items: center;
    } 

  /* Table as cards */
  .cart-table,
  .cart-table thead,
  .cart-table tbody,
  .cart-table th,
  .cart-table tr,
  .cart-table td {
    display: block;
    width: 100%;
  }

  .cart-table thead {
    display: none;
  }

  .cart-table tr {
    background: rgba(255,255,255,.06);
    margin-bottom: 1rem;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }

  .cart-view {
        padding: 5rem;
    }

  .cart-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    padding: 6px 0;
    gap: 8px;
  }

  .cart-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #ddd;
    flex: 1 1 40%;
  }

  .product-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .product-cell .thumb {
    width: 80px;
    height: 80px;
  }

  .qty {
    gap: 4px;
  }

  .qty input {
    width: 60px;
  }

  /* Summary adjustments */
  .summary {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-top: 1rem;
  }

  .summary-left,
  .summary-right {
    flex-direction: column;
    gap: 8px;
  }

  .summary-right {
    align-items: stretch;
  }

  .btn {
    width: 100%;
    padding: 10px 0;
  }
}

/* DIALOG */
.checkout-dialog {
  border: none;
  border-radius: 12px;
  background: var(--moro);
  color: #fff;
  padding: 2rem;
  max-width: 500px;
  box-shadow: 0 15px 35px rgba(0,0,0,.5);
}

.checkout-dialog::backdrop {
  background: rgba(0, 0, 0, 0.7);
}

.dialog-content h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 6px;
  background: rgba(0,0,0,.2);
  color: #fff;
  font-size: 1rem;
}

.form-group input::placeholder {
  color: rgba(255,255,255,.5);
}

.dialog-actions {
  display: flex;
  gap: 10px;
  margin-top: 1.5rem;
}

.dialog-actions button {
  flex: 1;
}

/* Extra small screens */
@media (max-width: 400px) {
  .thumb {
    width: 60px;
    height: 60px;
  }

  .cart-title {
    font-size: 1.5rem;
  }

  .qty button {
    width: 28px;
    height: 28px;
  }

  .qty input {
    width: 50px;
  }

  .checkout-dialog {
    max-width: 90vw;
    padding: 1.5rem;
  }

  .dialog-actions {
    flex-direction: column;
  }
}
</style>