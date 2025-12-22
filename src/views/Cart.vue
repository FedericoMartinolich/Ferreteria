<template>
    <h1 class="cart-title">
        <i class="fa-solid fa-cart-shopping"></i> Mi carrito
    </h1>

    <section class="cart-view">

        <div v-if="cart.length === 0" class="empty">
            <img
                :src="emptyCart"
                alt="Carrito vacío"
            />
            <p>Tu carrito está vacío</p>
            <router-link to="/" class="btn">Continuar comprando</router-link>
        </div>


        <div v-else>
            <table class="cart-table" aria-label="Shopping cart">
                <thead>
                    <tr>
                        <th class="center">Producto</th>
                        <th class="center">Precio</th>
                        <th class="center">Cantidad</th>
                        <th class="center">Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cart" :key="item.id">
                        <td>
                            <img v-if="item.image" :src="item.image" alt="" class="thumb" />
                            <div class="meta">
                                <div class="name">{{ item.name }}</div>
                                <!-- <div class="sku" v-if="item.sku">SKU: {{ item.sku }}</div> -->
                            </div>
                        </td>
                        <td class="center">{{ formatCurrency(item.price) }}</td>
                        <td class="center">
                            <div class="qty">
                                <button @click="decrease(item)" :aria-label="'Decrease ' + item.name">−</button>
                                <input type="number" v-model.number="item.qty" min="1" />
                                <button @click="increase(item)" :aria-label="'Increase ' + item.name">+</button>
                            </div>
                        </td>
                        <td class="center">{{ formatCurrency(item.price * item.qty) }}</td>
                        <td class="actions">
                            <button class="link" @click="removeItem(item.id)">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="summary">
                <div class="left">
                    <button class="btn danger" @click="clearCart">Borrar todo</button>
                    <router-link to="/" class="btn">Continuar comprando</router-link>
                </div>

                <div class="right">
                    <div class="totals">
                        <div>Items: <strong>{{ totalItems }}</strong></div>
                        <div>Total: <strong>{{ formatCurrency(totalPrice) }}</strong></div>
                    </div>
                    <div class="actions-vertical">
                        <button class="btn primary" @click="checkout">Realizar pedido</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <dialog ref="checkoutDialog" class="dialog">
            <div class="dialog-form">
                <div class="header">
                    <h1>Pedido</h1>
                    <button type="button" class="btn3 cancel" @click="closeDialog">
                        <i class="fa-solid fa-xmark"></i> Cancelar
                    </button>
                </div>
                <p>El pedido será procesado una vez confirmado el pago y se entregará en el destino indicado mediante un cadete.</p>

                <div class="form-grid">
                    <div class="field">
                        <label for="firstName">Nombre</label>
                        <input id="firstName" v-model="form.firstName" type="text" required>
                    </div>

                    <div class="field">
                        <label for="lastName">Apellido</label>
                        <input id="lastName" v-model="form.lastName" type="text" required>
                    </div>

                    <div class="field">
                        <label for="email">Email</label>
                        <input id="email" v-model="form.email" type="email" required>
                    </div>

                    <div class="field">
                        <label for="phone">Teléfono</label>
                        <input id="phone" v-model="form.phone" type="tel" required>
                    </div>

                    <div class="field full">
                        <label for="address">Dirección</label>
                        <input id="address" v-model="form.address" type="text" required>
                    </div>
                </div>

                <p>Realizar el pedido por...</p>

                <div class="options">
                    <button type="button" @click="cargarWhatsApp" class="btn2 btn-whatsapp" :disabled="!isFormValid">
                        <i class="fa-brands fa-whatsapp"></i> WhatsApp
                    </button>
                    <button type="button" @click="cargarMail" class="btn2 btn-gmail" :disabled="!isFormValid">
                        <i class="fa-regular fa-envelope"></i> Gmail
                    </button>
                </div>

            </div>
        </dialog>

    </section>
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
.cart-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 2rem;
    margin-top: 6rem;
    margin-bottom: 1.5rem;
    color: #f5f5f5;
}

.cart-title i {
    color: var(--llave);
    font-size: 1.8rem;
}

/* Empty */
.empty {
  text-align: center;
  padding: 60px 0;
  opacity: 0.95;
}

.empty img {
  width: 140px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.empty p {
  font-size: 1.1rem;
  margin-bottom: 16px;
}



.cart-view {
    max-width: 980px;
    margin: 32px auto;
    padding: 0 16px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: white;
    background-color: var(--moro);
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 5px 10px 20px 5px #0f0b05;
    border: 1px solid transparent;
    border-color: #3f382d4b;
}

h1 {
    margin-top: 10rem;
    margin-bottom: 20px;
    font-size: 1.5rem;
    text-align: start;
}

.empty {
    text-align: center;
    padding: 40px 0;
}

.cart-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 18px;
    background: rgba(255,255,255,0.03);
    /* border-radius: 12px; */
    overflow: hidden;
}

.cart-table thead {
  background: rgba(0,0,0,0.25);
}

.cart-table tr {
  transition: background 0.2s ease;
}

.cart-table tbody tr:hover {
  background: rgba(255,255,255,0.04);
}


.cart-table th,
.cart-table td {
    padding: 12px 8px;
    border-bottom: 1px solid #e6e6e6;
    vertical-align: middle;
}

.cart-table th.center,
.cart-table td.center {
    text-align: center;
}

.product {
    display: flex;
    align-items: center;
    gap: 12px;
}

.thumb {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
    background: #f5f5f5;
}

.meta .name {
    font-weight: 600;
}

.sku {
    font-size: 0.85rem;
    color: #666;
    margin-top: 6px;
}

.qty {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.qty input {
    width: 56px;
    text-align: center;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
}

.qty button {
    padding: 6px 10px;
    border-radius: 6px;
    background: #252525;
    border: 1px solid #ddd;
    cursor: pointer;
}

.actions .link {
    background: none;
    border: none;
    color: #d9534f;
    cursor: pointer;
    font-size: 0.95rem;
}

.summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
    flex-wrap: wrap;
}

.summary .left { display:flex; gap:8px; align-items:center; }
.summary .right { display:flex; gap:12px; align-items:center; }

.totals { text-align: right; min-width: 160px; }

.actions-vertical { display:flex; flex-direction:column; gap:8px; }

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
    border-color: #0063b1;
}

.btn.danger {
    background: #fff0f0;
    color: #b03030;
    border-color: #f0c0c0;
}

/* ===== DIALOG ===== */
.dialog {
    border: none;
    border-radius: 14px;
    width: 90%;
    max-width: 620px;
    padding: 0;
    background: rgb(95, 95, 95);
    color: #fcfcfc;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}

.dialog::backdrop {
    background: rgba(0, 0, 0, 0.65);
}

.dialog-form {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.dialog-form h3 {
    margin: 0;
    text-align: center;
    font-size: 1.3rem;
}

.dialog-form p {
    text-align: center;
    color: #c4c4c4;
    margin: 0;
}

/* ===== OPTIONS ===== */
.options {
    display: flex;
    gap: 12px;
    justify-content: center;
}

/* ===== BOTONES WHATSAPP / GMAIL ===== */
.btn2 {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    cursor: pointer;
    color: #fff;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-whatsapp {
    background: #25D366;
}

.btn-gmail {
    background: #EA4335;
}

.btn2:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

/* ===== CONFIRM / CANCEL ===== */
.confirm {
    display: flex;
    gap: 12px;
}

.btn3 {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    color: #fff;
}

.btn3.cancel {
    background: #9e9e9e;
}

.btn3.confirm {
    background: #4CAF50;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* exactamente 2 columnas */
    gap: 16px;
}

.field {
    display: flex;
    flex-direction: column;
}

.field.full {
    grid-column: 1 / -1; /* ocupa toda la fila */
}

.field label {
    font-weight: 500;
    margin-bottom: 6px;
    color: #ffffff;
}

.field input {
    padding: 8px 10px;
    border-radius: 0px;
    border: 1px solid #ccc;
    font-size: 14px;
}

@media (max-width: 900px) {
  .cart-view {
    padding: 1.5rem;
  }

  .cart-table th,
  .cart-table td {
    padding: 10px 6px;
    font-size: 14px;
  }

  .thumb {
    width: 52px;
    height: 52px;
  }

  .summary {
    gap: 12px;
  }
}
@media (max-width: 700px) {
  .summary {
    flex-direction: column;
    align-items: stretch;
  }

  .summary .left,
  .summary .right {
    width: 100%;
    justify-content: space-between;
  }

  .totals {
    text-align: left;
  }

  .actions-vertical .btn {
    width: 100%;
  }
}
@media (max-width: 600px) {
  .dialog {
    width: 95%;
    max-width: none;
  }

  .dialog-form {
    padding: 16px;
  }

  .options {
    flex-direction: column;
  }

  .btn2 {
    width: 100%;
  }

  .header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}

</style>