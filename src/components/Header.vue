<template>
  <header class="app-header">

    <!-- FILA SUPERIOR -->
    <div class="top-header">
      <div class="container top-row">

        <!-- LOGO -->
        <router-link to="/" class="brand">
          <img v-if="logo" :src="logo" :alt="title" class="logo" />
          <span class="title">{{ title }}</span>
        </router-link>

        <!-- BUSCADOR -->
        <div class="search-area">
          <Searcher search-placeholder="Buscar producto..." />
        </div>

        <!-- CARRITO -->
        <router-link to="/cart">
          <button class="cart" @click="$emit('toggle-cart')">
            <i class="fa-solid fa-cart-shopping"></i>
            <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
          </button>
        </router-link>

        <!-- BURGER MOBILE -->
        <button
          class="burger"
          @click="mobileOpen = !mobileOpen"
          :aria-expanded="mobileOpen"
        >
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- FILA INFERIOR -->
    <div class="bottom-header">
      <div class="container">

        <nav :class="{ open: mobileOpen }" class="nav">
          <ul>
            <li v-for="link in links" :key="link.href">
              <RouterLink :to="link.href" :class="{ active: isActive(link.href) }">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

      </div>
    </div>

    <!-- RESULTADOS BUSCADOR -->
    <div v-if="filteredProducts.length" class="search-results">
      <div class="result-item" v-for="p in filteredProducts" :key="p.id">
        <router-link :to="`/ProductDetail/${p.id}`" class="result-link">
          <img v-if="p.thumbnail" :src="p.thumbnail" class="result-thumb" />
          <span class="result-title">{{ p.product }}</span>
        </router-link>
      </div>
    </div>

  </header>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getProducts } from "../services/products.js";
import Searcher from "./Searcher.vue";

const route = useRoute();

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

function isActive(href) {
  if (href === '/') return route.path === '/';
  return route.path.startsWith(href);
}

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
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* CONTENEDOR GENERAL */
.container {
  max-width: 1200px;
  margin: auto;
  padding: 0 1rem;
}

/* ==========================
   HEADER SUPERIOR
========================== */
.top-header {
  background: var(--fondo);
  border-bottom: 2px solid var(--moro);
}

.top-row {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: .6rem;
  flex-shrink: 0;
}

.logo {
  height: 60px;
}

.title {
    text-shadow: 0 0 3px #000, 0 0 3px #000, 0 0 3px #000;
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
}

/* BUSCADOR */
.search-area {
  flex: 1;
}

input {
  width: 100%;
  padding: 13px 16px 13px 44px;
  font-size: 16px;
  border-radius: 12px;
  border: 2px solid #c46a2b;
  background: #ffffff;
  color: #4a3728;
  transition: box-shadow 0.3s ease, border 0.3s ease;
}

/* CARRITO */
.cart {
    padding: 0;
  position: relative;
  background: none;
  border: none;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
      text-shadow: 0 0 3px #000, 0 0 3px #000, 0 0 3px #000;
}

.badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: red;
  color: white;
  font-size: .75rem;
  padding: 2px 6px;
  border-radius: 999px;
}

/* ==========================
   HEADER INFERIOR
========================== */
.bottom-header {
  background: #d17219;
}

.nav ul {
  display: flex;
  justify-content: center;
  gap: 1rem;
  list-style: none;
  padding: .7rem 0;
  margin: 0;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: .45rem .8rem;
  border-radius: 6px;
  font-weight: 500;
  transition: .2s;
}

.nav a:hover {
  background: rgba(255,255,255,.18);
}

.nav a.active {
  color: rgba(255,255,255,.5);
  pointer-events: none;
}

/* ==========================
   MOBILE
========================== */
.burger {
    padding: 0;
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
}

@media (max-width: 500px) {
    .burger {
        display: block;
        text-shadow: 0 0 3px #000, 0 0 3px #000, 0 0 3px #000;
    }
    
    .nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #d17219;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }
    
    .nav.open {
        max-height: 300px; /* Ajusta según el número de enlaces */
    }
    
    .nav ul {
        list-style: none;
        gap: 0;
    }
    
    .nav a {
        padding: .75rem;
    }

    .search-area {
        display: none;
    }
}
</style>