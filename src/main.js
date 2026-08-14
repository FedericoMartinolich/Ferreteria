import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "leaflet/dist/leaflet.css";

function clearCartAfterPayment() {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('collection_status')
    if (!params.has('payment_id')) return
    if (status && status !== 'approved') return
    try {
        localStorage.removeItem('cart')
    } catch {
        /* sin acceso a localStorage */
    }
    window.dispatchEvent(new Event('cart-updated'))
}

clearCartAfterPayment()

createApp(App)
    .use(router)
    .mount('#app')
