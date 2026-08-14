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

      <div v-if="successOrder" class="order-success">
        <div class="success-icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3>Pedido confirmado</h3>
        <p class="order-id">Nro. {{ lastOrder.id }}</p>

        <ul class="order-summary-list">
          <li>
            <span>Medio de pago</span>
            <strong>{{ paymentMethodLabel(lastOrder) }}</strong>
          </li>
          <li>
            <span>Estado de pago</span>
            <strong class="ok">{{ statusLabel(lastOrder.payment.status) }}</strong>
          </li>
          <li>
            <span>Envío</span>
            <strong>{{ shippingOptionLabel(lastOrder) }}</strong>
          </li>
          <li v-if="lastOrder.shipping.tracking">
            <span>Seguimiento</span>
            <strong>{{ lastOrder.shipping.tracking }}</strong>
          </li>
          <li>
            <span>Total</span>
            <strong>{{ formatCurrency(lastOrder.totals.total) }}</strong>
          </li>
        </ul>

        <button type="button" class="btn primary btn-success-close" @click="resetCheckout">
          <i class="fa-solid fa-check"></i> Listo
        </button>
      </div>

      <form v-else @submit.prevent>
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
            <label>Código postal <small>(para calcular el envío)</small></label>
            <input v-model="form.postal_code" type="text" inputmode="numeric" placeholder="Ej. 2820" @input="onPostalChange" />
          </div>

          <div class="form-group" v-if="showAddress">
            <label>Dirección</label>
            <input v-model="form.address" placeholder="Calle 123, Ciudad" />
          </div>

          <div class="form-group full" v-if="isPickup">
            <label>Retirás en</label>
            <p class="pickup-note">{{ pickupAddress }}</p>
          </div>

          <div class="form-group full" v-if="shippingOptions.length">
            <label>Envío</label>
            <div class="choice-list">
              <label
                v-for="option in shippingOptions"
                :key="shippingKey(option)"
                class="choice-item"
                :class="{ selected: selectedShipping === shippingKey(option) }"
              >
                <input v-model="selectedShipping" type="radio" name="shipping" :value="shippingKey(option)" />
                <span class="choice-main">
                  <strong>{{ option.label }}</strong>
                  <small>{{ option.eta }}</small>
                </span>
                <span class="choice-cost">{{ option.cost ? formatCurrency(option.cost) : 'Gratis' }}</span>
                <i class="fa-solid fa-check choice-check"></i>
              </label>
            </div>
          </div>

          <div class="form-group full" v-if="paymentMethods.length">
            <label>Medio de pago</label>
            <div class="choice-list">
              <label
                v-for="method in paymentMethods"
                :key="paymentKey(method)"
                class="choice-item"
                :class="{ selected: selectedPayment === paymentKey(method) }"
              >
                <input v-model="selectedPayment" type="radio" name="payment" :value="paymentKey(method)" />
                <span class="choice-main">
                  <strong>{{ method.name }}</strong>
                  <small>{{ method.instructions }}</small>
                </span>
                <i class="fa-solid fa-check choice-check"></i>
              </label>
            </div>
          </div>
        </div>

        <div class="dialog-totals" v-if="shippingOptions.length || paymentMethods.length">
          <div class="total-line">
            <span>Productos</span>
            <strong>{{ formatCurrency(totalPrice) }}</strong>
          </div>
          <div class="total-line" v-if="shippingOptions.length">
            <span>Envío ({{ selectedShippingOption?.label }})</span>
            <strong>{{ formatCurrency(shippingCost) }}</strong>
          </div>
          <div class="total-divider"></div>
          <div class="total-line total-final">
            <span>Total</span>
            <strong>{{ formatCurrency(grandTotal) }}</strong>
          </div>
        </div>

        <p v-if="processingError" class="dialog-error">
          <i class="fa-solid fa-circle-exclamation"></i> {{ processingError }}
        </p>

        <div class="dialog-actions">
          <button type="button" class="btn outline" @click="closeDialog">
            <i class="fa-solid fa-arrow-left"></i> Cancelar
          </button>

          <button
            type="button"
            class="btn whatsapp"
            :disabled="!isFormValid || orderProcessing"
            @click="cargarWhatsApp"
          >
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </button>

          <button
            type="button"
            class="btn primary btn-confirm"
            :disabled="!isFormValid || orderProcessing || !selectedPayment || !selectedShipping"
            @click="confirmOrder"
          >
            <i class="fa-solid fa-bag-shopping"></i>
            {{ orderProcessing ? 'Procesando…' : 'Confirmar pedido' }}
          </button>
        </div>
      </form>
    </div>
  </dialog>

    <ConfirmModal
      v-model="showClearConfirm"
      message="¿Desea vaciar el carrito?"
      @confirm="confirmClearCart"
      @cancel="showClearConfirm = false"
    />
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import emptyCart from '../assets/imgs/emptys/emptyCart.png'
import { getProductImage } from '../services/products'
import { useConfig } from '../composables/useConfig.js'
import ConfirmModal from '../components/ConfirmModal.vue'
import {
  registerBuiltInProviders,
  getEnabledPaymentProviders,
  getEnabledShippingProviders,
  createOrder,
  getOrderById,
  setPaymentStatus,
  setShippingStatus,
} from '../services/checkout/index'

const { load: loadConfig, config, whatsapp, email: configEmail, direccion } = useConfig()

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
    postal_code: '',
})

const paymentProviders = ref([])
const shippingProviders = ref([])
const paymentMethods = ref([])
const shippingOptions = ref([])
const selectedShipping = ref(null)
const selectedPayment = ref(null)
const orderProcessing = ref(false)
const processingError = ref('')
const lastOrder = ref(null)

const isFormValid = computed(() => {
    const base =
        form.value.firstName.trim() !== '' &&
        form.value.lastName.trim() !== '' &&
        form.value.email.trim() !== '' &&
        form.value.phone.trim() !== ''
    if (!base) return false
    if (selectedShippingOption.value?.mode === 'pickup') return true
    return form.value.address.trim() !== '' && form.value.postal_code.trim() !== ''
})

// Load cart from localStorage (or seed with an example for dev)
onMounted(async () => {
    await loadConfig()
    await loadCheckoutProviders()
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
        window.dispatchEvent(new Event('cart-updated'))
    },
    { deep: true }
)

const totalItems = computed(() => cart.value.reduce((s, i) => s + (Number(i.qty) || 0), 0))
const totalPrice = computed(() => cart.value.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0))

function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value || 0)
}

function shippingKey(option) {
    return `${option.providerId}::${option.id}`
}

function paymentKey(method) {
    return `${method.providerId}::${method.id}`
}

const selectedShippingOption = computed(() =>
    shippingOptions.value.find(o => shippingKey(o) === selectedShipping.value)
)

const isPickup = computed(() => selectedShippingOption.value?.mode === 'pickup')
const showAddress = computed(() => !isPickup.value)
const pickupAddress = computed(
    () => direccion.value || 'Consultá la dirección de retiro.'
)

const selectedPaymentMethod = computed(() =>
    paymentMethods.value.find(m => paymentKey(m) === selectedPayment.value)
)

const shippingCost = computed(() => selectedShippingOption.value?.cost ?? 0)

const grandTotal = computed(() => totalPrice.value + shippingCost.value)

const successOrder = computed(() => lastOrder.value !== null && !orderProcessing.value)

async function loadCheckoutProviders() {
    registerBuiltInProviders()
    paymentProviders.value = getEnabledPaymentProviders(config.value)
    shippingProviders.value = getEnabledShippingProviders(config.value)

    await Promise.all([loadPaymentMethods(), loadShippingOptions()])

    if (paymentMethods.value.length) {
        selectedPayment.value = paymentKey(paymentMethods.value[0])
    }
    if (shippingOptions.value.length) {
        selectedShipping.value = shippingKey(shippingOptions.value[0])
    }
}

async function loadPaymentMethods() {
    const methods = []
    for (const provider of paymentProviders.value) {
        if (typeof provider.isEnabled === 'function' && !provider.isEnabled(config.value)) continue
        const list = await provider.getPaymentMethods(config.value)
        list.forEach(m => methods.push({ ...m, providerId: provider.id }))
    }
    paymentMethods.value = methods
}

async function loadShippingOptions() {
    const options = []
    const postal = form.value.postal_code?.trim() || ''
    for (const provider of shippingProviders.value) {
        if (typeof provider.isEnabled === 'function' && !provider.isEnabled(config.value)) continue
        if (provider.id === 'external' && !postal) continue
        const list = await provider.getOptions({
            items: cart.value,
            subtotal: totalPrice.value,
            destination: form.value.address,
            postal_code: postal,
            config: config.value,
        })
        list.forEach(o => options.push({ ...o, providerId: provider.id }))
    }
    shippingOptions.value = options

    const current = selectedShipping.value
    if (options.length && !options.some(o => shippingKey(o) === current)) {
        selectedShipping.value = shippingKey(options[0])
    }
}

let postalTimer = null
function onPostalChange() {
    clearTimeout(postalTimer)
    postalTimer = setTimeout(async () => {
        await loadShippingOptions()
    }, 500)
}

async function confirmOrder() {
    const option = selectedShippingOption.value
    const method = selectedPaymentMethod.value
    if (!option || !method) return

    orderProcessing.value = true
    processingError.value = ''
    lastOrder.value = null

    try {
        const order = createOrder({
            items: cart.value,
            customer: {
                firstName: form.value.firstName,
                lastName: form.value.lastName,
                email: form.value.email,
                phone: form.value.phone,
                address: form.value.address,
                postal_code: form.value.postal_code,
            },
            totals: {
                products: totalPrice.value,
                shipping: shippingCost.value,
                total: grandTotal.value,
            },
            payment: { providerId: method.providerId, methodId: method.id },
            shipping: { providerId: option.providerId, optionId: option.id },
        })

        const payProvider = paymentProviders.value.find(p => p.id === method.providerId)
        if (!payProvider) throw new Error('No hay un proveedor de pago seleccionado')

        const paymentRef = await payProvider.createPayment({ order, method, config: config.value })

        if (payProvider.id === 'external') {
            const link = paymentRef?.link || paymentRef?.init_point
            if (!link) {
                throw new Error(paymentRef?.message || 'No se obtuvo un link de pago.')
            }
            window.location.assign(link)
            return
        }

        await simulateConfirmation(order.id, payProvider, paymentRef, method, option)

        lastOrder.value = getOrderById(order.id)
        cart.value = []
    } catch (error) {
        processingError.value = error?.message || 'No se pudo procesar el pedido.'
    } finally {
        orderProcessing.value = false
    }
}

async function simulateConfirmation(orderId, payProvider, paymentRef, method, option) {
    await new Promise(resolve => setTimeout(resolve, 1200))

    const confirmed = await payProvider.confirmPayment({
        order: getOrderById(orderId),
        method,
        paymentRef,
        config: config.value,
    })
    if (confirmed?.status) {
        setPaymentStatus(orderId, confirmed.status, confirmed.detail)
    }

    const shipProvider = shippingProviders.value.find(p => p.id === option.providerId)
    if (shipProvider) {
        const shipment = await shipProvider.createShipment({
            order: getOrderById(orderId),
            option,
            config: config.value,
        })
        setShippingStatus(orderId, shipment?.status || 'pending', { tracking: shipment?.tracking })
    }
}

function paymentMethodLabel(order) {
    const method = paymentMethods.value.find(m =>
        m.providerId === order.payment.providerId && m.id === order.payment.methodId
    )
    return method?.name || 'Pago'
}

function shippingOptionLabel(order) {
    const option = shippingOptions.value.find(o =>
        o.providerId === order.shipping.providerId && o.id === order.shipping.optionId
    )
    return option?.label || order.shipping.optionId || 'Envío'
}

function statusLabel(status) {
    const labels = {
        paid: 'Pagado',
        approved: 'Aprobado',
        pending: 'Pendiente',
        created: 'Creado',
        ready: 'Listo',
        shipped: 'Enviado',
        delivered: 'Entregado',
    }
    return labels[status] || status
}

function resetCheckout() {
    lastOrder.value = null
    processingError.value = ''
    checkoutDialog.value?.close()
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

const showClearConfirm = ref(false)

function clearCart() {
    showClearConfirm.value = true
}

function confirmClearCart() {
    cart.value = []
    showClearConfirm.value = false
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
${isPickup.value
    ? `Retiro en el local: ${pickupAddress.value}`
    : `Dirección: ${form.value.address} (CP ${form.value.postal_code})`}
Productos:
${productos}

Envío: ${selectedShippingOption.value?.label || ''} (${formatCurrency(shippingCost.value)})
Medio de pago: ${selectedPaymentMethod.value?.name || ''}
Total: ${formatCurrency(grandTotal.value)}
`
  const url = `https://wa.me/${whatsapp.value}?text=${encodeURIComponent(message)}`
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
${isPickup.value
    ? `Retiro en el local: ${pickupAddress.value}`
    : `Dirección: ${form.value.address} (CP ${form.value.postal_code})`}

Productos:
${productos}

Envío: ${selectedShippingOption.value?.label || ''} (${formatCurrency(shippingCost.value)})
Medio de pago: ${selectedPaymentMethod.value?.name || ''}
Total: ${formatCurrency(grandTotal.value)}`.trim()

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${configEmail.value}` +
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
  color: var(--navy);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.cart-title i {
  color: var(--orange);
}

.cart-badge {
  background: var(--orange);
  color: var(--white);
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
  background: var(--white);
  border-radius: var(--radius-5xl);
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  width: 160px;
  height: 160px;
  margin: 0 auto 1.5rem;
  opacity: 0.6;
}

.empty-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.empty h2 {
  color: var(--navy);
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
}

.empty p {
  color: var(--gray-600);
  margin: 0 0 2rem;
  font-size: 0.95rem;
}

/* ===========================
   CART CONTENT
   =========================== */
.cart-content {
  background: var(--white);
  border-radius: var(--radius-5xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

/* ===========================
   TABLE HEADER
   =========================== */
.table-header {
  display: grid;
  grid-template-columns: 1fr 120px 130px 130px 44px;
  gap: 1rem;
  padding: 0 0.5rem 0.75rem;
  border-bottom: 2px solid var(--gray-200);
  margin-bottom: 0.25rem;
}

.table-header span {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gray-400);
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
  border-bottom: 1px solid var(--gray-200);
  transition: background 0.2s ease;
  animation: fadeSlideIn 0.3s ease both;
}

.item-row:hover {
  background: var(--gray-50);
  border-radius: var(--radius-xl);
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
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: var(--gray-100);
  flex-shrink: 0;
  border: 1px solid var(--gray-200);
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
  color: var(--orange);
  font-size: 1.3rem;
}

.item-info {
  min-width: 0;
}

.item-name {
  display: block;
  font-weight: 600;
  color: var(--navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
}

.item-sku {
  display: block;
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: 0.2rem;
}

/* ===========================
   PRICE & SUBTOTAL
   =========================== */
.item-price {
  font-weight: 600;
  color: var(--gray-600);
  font-size: 0.9rem;
  text-align: center;
}

.item-subtotal {
  font-weight: 700;
  color: var(--orange);
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
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  background: var(--gray-50);
  color: var(--navy);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: var(--gray-100);
  border-color: var(--gray-400);
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
  color: var(--navy);
}

/* ===========================
   REMOVE
   =========================== */
.remove-btn {
  border: none;
  background: transparent;
  color: var(--gray-400);
  cursor: pointer;
  font-size: 0.85rem;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  justify-self: end;
}

.remove-btn:hover {
  background: rgba(220, 50, 50, 0.08);
  color: var(--danger);
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
  border-top: 2px solid var(--gray-200);
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
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-3xl);
  padding: 1rem 1.25rem;
  min-width: 180px;
  box-sizing: border-box;
}

.total-line {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--gray-600);
}

.total-line strong {
  margin-left: auto;
  padding-left: 0.5rem;
}

.total-line strong {
  color: var(--navy);
}

.total-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 0.5rem 0;
}

.total-final {
  font-size: 1.1rem;
  color: var(--orange);
}

.total-final strong {
  color: var(--orange);
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
  border-radius: var(--radius-xl);
  padding: 0.7rem 1.1rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-sizing: border-box;
}

.btn.primary {
  background: var(--navy);
  color: var(--white);
}

.btn.primary:hover {
  transform: translateY(-2px);
  background: var(--orange);
}

.btn.outline {
  background: transparent;
  border: 1px solid var(--gray-200);
  color: var(--gray-600);
}

.btn.outline:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
  color: var(--navy);
}

.btn.outline.danger {
  border-color: rgba(255, 100, 100, 0.3);
  color: var(--danger);
}

.btn.outline.danger:hover {
  background: rgba(220, 50, 50, 0.06);
  border-color: rgba(255, 100, 100, 0.5);
}

.btn.whatsapp {
  background: var(--whatsapp);
  color: var(--white);
}

.btn.whatsapp:hover {
  background: var(--whatsapp-hover);
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
  border-radius: var(--radius-6xl);
  overflow: hidden;
  background: transparent;
  padding: 0;
}

.checkout-dialog::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.dialog-content {
  background: var(--white);
  color: var(--gray-800);
  padding: 0;
  width: min(92vw, 520px);
  box-shadow: var(--shadow-xl);
  border-radius: var(--radius-6xl);
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
  color: var(--navy);
}

.dialog-header h2 i {
  color: var(--orange);
}

.dialog-close {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--radius-xl);
  border: 1px solid var(--gray-200);
  background: var(--gray-50);
  color: var(--gray-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.dialog-close:hover {
  background: var(--gray-100);
  color: var(--navy);
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

.pickup-note {
  margin: 0;
  padding: 0.6rem 0.9rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  font-size: 0.9rem;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--gray-200);
  background: var(--gray-50);
  color: var(--navy);
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: var(--gray-400);
}

.form-group input:focus {
  outline: none;
  border-color: var(--orange);
  box-shadow: 0 0 0 3px rgba(232, 106, 16, 0.1);
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

.dialog-totals {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-3xl);
  margin: 0 1.5rem;
  padding: 0.9rem 1.25rem;
}

.dialog-totals .total-line {
  font-size: 0.85rem;
  color: var(--gray-600);
}

.dialog-totals .total-final strong {
  color: var(--orange);
}

.dialog-error {
  margin: 0.75rem 1.5rem 0;
  padding: 0.6rem 0.9rem;
  border-radius: var(--radius-xl);
  background: rgba(220, 50, 50, 0.08);
  color: var(--danger);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.choice-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.choice-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-xl);
  background: var(--gray-50);
  cursor: pointer;
  transition: all 0.2s ease;
}

.choice-item:hover {
  border-color: var(--gray-300);
}

.choice-item.selected {
  border-color: var(--orange);
  background: rgba(232, 106, 16, 0.06);
}

.choice-item input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.choice-main {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.choice-main strong {
  font-size: 0.88rem;
  color: var(--navy);
}

.choice-main small {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.choice-cost {
  margin-left: auto;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--orange);
  white-space: nowrap;
}

.choice-check {
  color: var(--orange);
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.2s ease;
}

.choice-item.selected .choice-check {
  opacity: 1;
  transform: scale(1);
}

.btn-success-close {
  width: 100%;
  justify-content: center;
}

.order-success {
  padding: 2rem 1.5rem;
  text-align: center;
}

.success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: rgba(22, 163, 74, 0.12);
  color: var(--success);
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-success h3 {
  margin: 0 0 0.25rem;
  color: var(--navy);
  font-size: 1.25rem;
}

.order-id {
  margin: 0 0 1.25rem;
  font-size: 0.85rem;
  color: var(--gray-500);
}

.order-summary-list {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0.75rem 1rem;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-3xl);
  text-align: left;
}

.order-summary-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.45rem 0;
  font-size: 0.85rem;
  color: var(--gray-600);
}

.order-summary-list li + li {
  border-top: 1px solid var(--gray-200);
}

.order-summary-list li strong {
  color: var(--navy);
}

.order-summary-list li strong.ok {
  color: var(--success);
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
    background: var(--gray-50);
    border-radius: var(--radius-3xl);
    margin-bottom: 0.5rem;
    border-bottom: none;
  }

  .item-row:hover {
    background: var(--gray-100);
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
    color: var(--gray-400);
  }

  .item-subtotal {
    text-align: left;
  }

  .item-subtotal::before {
    content: 'Subtotal: ';
    font-weight: 400;
    color: var(--gray-400);
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

  .total-final strong {
    font-size: 1rem;
  }
}
</style>