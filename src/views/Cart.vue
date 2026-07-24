<template>
  <div class="cart-page">
    <h1 class="cart-title">
      <i class="fa-solid fa-cart-shopping"></i> Mi carrito
      <span v-if="cart.length" class="cart-badge">{{ totalItems }}</span>
    </h1>

    <div class="container">

      <!-- Carrito vacío -->
      <div v-if="cart.length === 0" class="empty">
        <div class="empty-icon">
          <img :src="emptyCart" alt="Carrito vacío" />
        </div>
        <h2>Tu carrito está vacío</h2>
        <p>¿No encontrás lo que buscás? Explorá nuestro catálogo</p>
        <router-link to="/products" class="btn primary">
          <i class="fa-solid fa-store"></i> Ver productos
        </router-link>
      </div>

      <!-- Carrito con productos -->
      <div v-else class="cart-content">

        <!-- Header de la tabla -->
        <div class="table-header">
          <span class="th-product">Producto</span>
          <span class="th-price">Precio</span>
          <span class="th-qty">Cantidad</span>
          <span class="th-subtotal">Subtotal</span>
          <span class="th-remove"></span>
        </div>

        <!-- Items -->
        <div class="item-row" v-for="(item, index) in cart" :key="item.id" :style="{ animationDelay: index * 0.05 + 's' }">

          <div class="item-product">
            <div class="thumb-box">
              <img v-if="item.image" :src="item.image" class="thumb" :alt="item.name" loading="lazy" />
              <div v-else class="thumb-placeholder">
                <i class="fa-solid fa-wrench"></i>
              </div>
            </div>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-sku" v-if="item.sku">SKU: {{ item.sku }}</span>
            </div>
          </div>

          <div class="item-price">{{ formatCurrency(item.price) }}</div>

          <div class="qty">
            <button class="qty-btn" @click="decrease(item)" :disabled="item.qty <= 1">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="qty-value">{{ item.qty }}</span>
            <button class="qty-btn" @click="increase(item)">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <div class="item-subtotal">{{ formatCurrency(item.price * item.qty) }}</div>

          <button class="remove-btn" @click="removeItem(item.id)" title="Eliminar producto">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

        <!-- Resumen -->
        <div class="summary">
          <div class="summary-left">
            <button class="btn outline danger" @click="clearCart">
              <i class="fa-solid fa-xmark"></i> Vaciar carrito
            </button>
            <router-link to="/products" class="btn outline">
              <i class="fa-solid fa-arrow-left"></i> Seguir comprando
            </router-link>
          </div>

          <div class="summary-right">
            <div class="totals">
              <div class="total-line">
                <span>Productos</span>
                <strong>{{ totalItems }} u.</strong>
              </div>
              <div class="total-divider"></div>
              <div class="total-line total-final">
                <span>Total</span>
                <strong>{{ formatCurrency(totalPrice) }}</strong>
              </div>
            </div>
            <button class="btn primary btn-checkout" @click="checkout">
              <i class="fa-solid fa-bag-shopping"></i> Realizar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Checkout Dialog -->
  <dialog ref="checkoutDialog" class="checkout-dialog">
    <div class="dialog-content">
      <div class="dialog-header">
        <h2><i class="fa-solid fa-bag-shopping"></i> Completar pedido</h2>
        <button class="dialog-close" @click="closeDialog">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

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
          <button type="button" class="btn outline" @click="closeDialog">
            <i class="fa-solid fa-arrow-left"></i> Cancelar
          </button>

          <button
            type="button"
            class="btn whatsapp"
            :disabled="!isFormValid"
            @click="cargarWhatsApp"
          >
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </button>

          <button
            type="button"
            class="btn primary"
            :disabled="!isFormValid"
            @click="cargarMail"
          >
            <i class="fa-solid fa-envelope"></i> Email
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
/* ===========================
   PAGE
   =========================== */
.cart-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.cart-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  color: #f4f4f4;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.cart-title i {
  color: #e8a94a;
}

.cart-badge {
  background: linear-gradient(135deg, #c46a2b, #a85722);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ===========================
   EMPTY STATE
   =========================== */
.empty {
  background: linear-gradient(160deg, #3b2a1d, #5a3d2a);
  border-radius: 18px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.empty-icon {
  width: 160px;
  height: 160px;
  margin: 0 auto 1.5rem;
  opacity: 0.7;
}

.empty-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.empty h2 {
  color: #f4f4f4;
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
}

.empty p {
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 2rem;
  font-size: 0.95rem;
}

/* ===========================
   CART CONTENT
   =========================== */
.cart-content {
  background: linear-gradient(160deg, #3b2a1d, #5a3d2a);
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* ===========================
   TABLE HEADER
   =========================== */
.table-header {
  display: grid;
  grid-template-columns: 1fr 120px 130px 130px 44px;
  gap: 1rem;
  padding: 0 0.5rem 0.75rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.25rem;
}

.table-header span {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
}

.th-price,
.th-qty,
.th-subtotal {
  text-align: center;
}

.th-remove {
  text-align: right;
}

/* ===========================
   ITEM ROW
   =========================== */
.item-row {
  display: grid;
  grid-template-columns: 1fr 120px 130px 130px 44px;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s ease;
  animation: fadeSlideIn 0.3s ease both;
}

.item-row:hover {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===========================
   PRODUCT CELL
   =========================== */
.item-product {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.thumb-box {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  font-size: 1.3rem;
}

.item-info {
  min-width: 0;
}

.item-name {
  display: block;
  font-weight: 600;
  color: #f0ebe6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
}

.item-sku {
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 0.2rem;
}

/* ===========================
   PRICE & SUBTOTAL
   =========================== */
.item-price {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  text-align: center;
}

.item-subtotal {
  font-weight: 700;
  color: #e8a94a;
  text-align: center;
  font-size: 0.95rem;
}

/* ===========================
   QUANTITY
   =========================== */
.qty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.qty-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #f0ebe6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  width: 40px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: #f0ebe6;
}

/* ===========================
   REMOVE
   =========================== */
.remove-btn {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  font-size: 0.85rem;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  justify-self: end;
}

.remove-btn:hover {
  background: rgba(220, 50, 50, 0.15);
  color: #ff6b6b;
}

/* ===========================
   SUMMARY
   =========================== */
.summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 2px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
}

.summary-left {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.summary-right {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-left: auto;
}

/* ===========================
   TOTALS
   =========================== */
.totals {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  min-width: 180px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.total-line strong {
  color: #f0ebe6;
}

.total-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0.5rem 0;
}

.total-final {
  font-size: 1.1rem;
  color: #e8a94a;
}

.total-final strong {
  color: #e8a94a;
  font-size: 1.2rem;
}

/* ===========================
   BUTTONS
   =========================== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  border-radius: 10px;
  padding: 0.7rem 1.1rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn.primary {
  background: linear-gradient(135deg, #c46a2b, #a85722);
  color: #fff;
  box-shadow: 0 2px 8px rgba(196, 106, 43, 0.3);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(196, 106, 43, 0.4);
}

.btn.outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
}

.btn.outline:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.btn.outline.danger {
  border-color: rgba(255, 100, 100, 0.3);
  color: #ff8a8a;
}

.btn.outline.danger:hover {
  background: rgba(220, 50, 50, 0.1);
  border-color: rgba(255, 100, 100, 0.5);
}

.btn.whatsapp {
  background: #25D366;
  color: white;
}

.btn.whatsapp:hover {
  background: #20bd5a;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-checkout {
  padding: 0.85rem 1.5rem;
  font-size: 0.95rem;
  width: 100%;
  justify-content: center;
}

/* ===========================
   DIALOG
   =========================== */
.checkout-dialog {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  background: transparent;
  padding: 0;
}

.checkout-dialog::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.dialog-content {
  background: linear-gradient(160deg, #3b2a1d, #5a3d2a);
  color: white;
  padding: 0;
  width: min(92vw, 520px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f0ebe6;
}

.dialog-header h2 i {
  color: #e8a94a;
}

.dialog-close {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.dialog-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  color: #f0ebe6;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.form-group input:focus {
  outline: none;
  border-color: #e8a94a;
  box-shadow: 0 0 0 3px rgba(232, 169, 74, 0.15);
}

.dialog-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
}

.dialog-actions .btn {
  justify-content: center;
}

/* ===========================
   RESPONSIVE TABLET
   =========================== */
@media (max-width: 850px) {
  .table-header {
    display: none;
  }

  .item-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 14px;
    margin-bottom: 0.5rem;
    border-bottom: none;
  }

  .item-row:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .item-product {
    gap: 0.85rem;
  }

  .item-price {
    text-align: left;
    font-size: 0.85rem;
  }

  .item-price::before {
    content: 'Precio: ';
    font-weight: 400;
    color: rgba(255, 255, 255, 0.35);
  }

  .item-subtotal {
    text-align: left;
  }

  .item-subtotal::before {
    content: 'Subtotal: ';
    font-weight: 400;
    color: rgba(255, 255, 255, 0.35);
  }

  .item-row > .item-price,
  .item-row > .qty,
  .item-row > .item-subtotal {
    grid-column: 1;
    padding-left: calc(64px + 0.85rem);
  }

  .remove-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.5rem;
  }

  .item-row {
    position: relative;
  }

  .summary,
  .summary-left,
  .summary-right {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }

  .summary-right {
    margin-left: 0;
  }

  .totals {
    min-width: 0;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

/* ===========================
   RESPONSIVE MOBILE
   =========================== */
@media (max-width: 560px) {
  .cart-page {
    padding: 1.5rem 0.75rem;
  }

  .cart-content {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    padding: 1.25rem;
  }

  .form-group.full {
    grid-column: 1;
  }

  .dialog-actions {
    grid-template-columns: 1fr;
    padding: 0 1.25rem 1.25rem;
  }
}
</style>