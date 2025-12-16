<template>
    <header class="app-header">
        <div class="container">
            <!-- LOGO -->
            <router-link to="/" class="brand">
                <img v-if="logo" :src="logo" :alt="title" class="logo" />
                <span class="title">{{ title }}</span>
            </router-link>

            <!-- BURGER -->
            <button class="burger" @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen">
                <i class="fa-solid fa-bars"></i>
            </button>

            <!-- OPTIONS -->
            <nav :class="{ open: mobileOpen }" class="nav">
                <ul>
                    <li v-for="link in links">
                        <RouterLink
                            :to="link.href"
                        >
                            {{ link.label }}
                        </RouterLink>
                    </li>
                </ul>
            </nav>

            <!-- BUSCADOR -->
            <div class="actions">
                <Searcher search-placeholder="Buscar producto..." />
            </div>
            
            <!-- RESULTADOS (OPCINES) -->
            <div v-if="filteredProducts.length" class="search-results">
                <div class="result-item" v-for="p in filteredProducts" :key="p.product">
                    <router-link :to="`/ProductDetail/${p.id}`" class="result-link">
                        <img v-if="p.thumbnail" :src="p.thumbnail" class="result-thumb" />
                        <span class="result-title">{{ p.product }}</span>
                    </router-link>
                </div>
            </div>

            <!-- CARRITO -->
            <router-link to="/cart">
                <button class="cart" @click="$emit('toggle-cart')">
                    <i class="fa fa-solid fa-cart-shopping"></i>
                    <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
                </button>
            </router-link>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { getProducts } from "../services/products.js";
import Searcher from "./Searcher.vue";

const props = defineProps({
    title: { type: String, default: 'Ferretería' },
    logo: { type: String, default: '' },
    links: {
        type: Array,
        default: () => [
            { label: 'Inicio', href: '/' },
            { label: 'Productos', href: '/products' },
            { label: 'Contacto', href: '/contact' },
            { label: 'Nosotros', href: '/about' }
        ]
    },
    cartCount: { type: Number, default: 0 },
    searchPlaceholder: { type: String, default: 'Buscar producto...' }
});

const mobileOpen = ref(false);

onMounted(async () => {
    products.value = await getProducts();
});

const products = ref([]);
const search = ref('');

const filteredProducts = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return [];
    
    return products.value.filter((p) => {   
        const result = p.product.toLowerCase().includes(q)
        return result;
    });
});

/* watch(search, (newVal) => {
    console.log('Search query:', newVal);
}); */
</script>

<style scoped>
/* ===========================
   Dropdown de resultados
=========================== */
.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: #1a1f27;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  padding: .5rem 0;
}

.result-item {
  display: flex;
  align-items: center;
  gap: .7rem;
  padding: .55rem 1rem;
  cursor: pointer;
  transition: background .15s;
}

.result-item:hover {
  background: rgba(255,255,255,0.08);
}

.result-thumb {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  object-fit: cover;
}

.result-title {
  color: white;
  font-size: .9rem;
  font-weight: 400;
}

/* Header */

.app-header {
    background: var(--fondo);
    border-bottom: 3px solid var(--moro);
    position: relative;
    top: 0;
    z-index: 20;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    /* padding: 0.5rem 1rem; */
    display: flex;
    align-items: center;
    gap: 1rem;
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.logo {
    height: 70px;
    width: auto;
}

.title {
    font-weight: 600;
    font-size: 2rem;
    color: #fff;
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    line-height: 1.7rem ;
    text-shadow: 0 0 3px #000, /* Sombra para simular el borde negro */
               0 0 3px #000,
               0 0 3px #000;
    font-weight: bold; /* Para que el borde se note más */
}

.burger {
    display: none;
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
}

.burger .bar {
    display: block;
    width: 20px;
    height: 2px;
    background: #333;
    margin: 3px 0;
}

.nav {
    margin-left: auto;
}

.nav ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav a {
    color: #333;
    text-decoration: none;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
}

.nav a:hover {
    background: #d17219;
    transition: background 200ms;
    color: #fff;
}

.actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-left: 1rem;
}

.search {
    display: flex;
    align-items: center;
    /* gap: 0.25rem; */
}

.search input {
    border: 1px solid var(--moro);
    padding: 6px 10px;
    border-radius: 10rem;
    font-size: 0.8rem;
    background-color: var(--moro);
}

.search button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
}

.cart {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
}

.badge {
    position: absolute;
    top: -6px;
    right: -8px;
    background: #e53e3e;
    color: #fff;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 999px;
}

.fa {
    font-size: 1.1rem;
    color: #333;
}

/* Responsive */
@media (max-width: 768px) {
    .burger {
        display: inline-flex;
        margin-left: 0.25rem;
    }

    .nav {
        position: absolute;
        left: 0;
        right: 0;
        top: 60px;
        background: var(--fondo);
        border-top: 1px solid var(--moro);
        display: none;
        padding: 0.75rem 1rem;
    }

    .nav.open {
        display: block;
    }

    .nav ul {
        flex-direction: column;
        gap: 0.5rem;
    }

    .container {
        align-items: center;
        margin-left: 5%;
        margin-right: 5%;
    }

    .actions {
        margin-left: 0;
    }
}
</style>