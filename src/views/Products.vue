<template>
  <NewProducts v-if="newProductsEvent" :data="newProductsEvent" />

  <section class="catalog">
    <h1 class="title">
      <i class="fas fa-tools"></i>
      Catálogo de Ferretería
    </h1>

    <div class="search-wrapper">
      <i class="fas fa-search search-icon"></i>
      <input
        v-model="search"
        placeholder="Buscar producto..."
        class="search-input"
      />
    </div>

    <div class="container">
      <router-link
        v-for="p in paginatedProducts"
        :key="p.id"
        :to="`/ProductDetail/${p.id}`"
        class="product-link"
      >
        <ProductCard :product="p" />
      </router-link>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        <i class="fas fa-chevron-left"></i>
      </button>

      <span>
        Página <strong>{{ currentPage }}</strong> de {{ totalPages }}
      </span>

      <button @click="nextPage" :disabled="currentPage === totalPages">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </section>
  <div v-if="showToast" class="toast">
    <i class="fa-solid fa-check"></i>
    {{ toast }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

import { getProducts } from "../services/products.js";
import { getNewProductsEvent } from "../services/events.js";

import ProductCard from "../components/ProductCard.vue";
import NewProducts from "../components/Div/NewProducts.vue";

const products = ref([]);
const newProductsEvent = ref(null);

const search = ref("");
const currentPage = ref(1);
const pageSize = 32;

onMounted(async () => {
  const [productsData, newProductsData] = await Promise.all([
    getProducts(),
    getNewProductsEvent()
  ]);

  products.value = productsData;
  newProductsEvent.value = newProductsData[0] || null;
});

/* 🔍 Filtro */
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.product.toLowerCase().includes(search.value.toLowerCase())
  )
);

/* 📄 Paginación */
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / pageSize)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProducts.value.slice(start, start + pageSize);
});

/* ⬅➡ Navegación */
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

/* 🔄 Reset página al buscar */
watch(search, () => {
  currentPage.value = 1;
});

const toast = ref(null)
const showToast = ref(false)

onMounted(() => {
  const raw = localStorage.getItem('toast')

  if (raw) {
    const data = JSON.parse(raw)

    // opcional: validar que no sea viejo (ej 3s)
    if (Date.now() - data.time < 3000) {
      toast.value = data.message
      showToast.value = true

      setTimeout(() => {
        showToast.value = false
      }, 2500)
    }

    localStorage.removeItem('toast')
  }
})
</script>

<style scoped>
/* ===============================
   CONTENEDOR GENERAL
   =============================== */

.catalog {
  max-width: 1200px;
  margin: 2.5rem;
  padding: 2.2rem 1.6rem;
  background: rgba(243, 237, 228, 0.95); /* Beige claro */
  border-radius: 18px;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.35);
  align-items: center;
}

/* ===============================
   TÍTULO
   =============================== */

.title {
  text-align: center;
  margin-bottom: 2.4rem;
  font-size: 2.3rem;
  color: #4a3728; /* Marrón oscuro */
  letter-spacing: 0.6px;
}

.title i {
  margin-right: 0.5rem;
  color: #c46a2b; /* Óxido */
}

/* ===============================
   BUSCADOR
   =============================== */

.search-wrapper {
  position: relative;
  max-width: 440px;
  margin: 0 auto 2.6rem;
}

.search-input {
  width: 100%;
  padding: 13px 16px 13px 44px;
  font-size: 16px;
  border-radius: 12px;
  border: 2px solid #c46a2b;
  background: #ffffff;
  color: #4a3728;
  transition: box-shadow 0.3s ease, border 0.3s ease;
}

.search-input::placeholder {
  color: #9c8573;
}

.search-input:focus {
  outline: none;
  border-color: #a85722;
  box-shadow: 0 0 0 4px rgba(196, 106, 43, 0.25);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #c46a2b;
  font-size: 16px;
  pointer-events: none;
}

/* ===============================
   GRID DE PRODUCTOS
   =============================== */

.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

/* ===============================
   LINKS
   =============================== */

.product-link {
  text-decoration: none;
  color: inherit;
}

/* ===============================
   PAGINACIÓN
   =============================== */

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.4rem;
  margin: 3.5rem 0 1.2rem;
  font-size: 15px;
  color: #4a3728;
}

.pagination span {
  font-weight: 500;
}

.pagination button {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Botones */

.pagination button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, #c46a2b, #a85722);
  color: #ffffff;
  font-size: 17px;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, filter 0.2s ease;
}

.pagination button:hover:not(:disabled) {
  transform: scale(1.12);
  filter: brightness(1.1);
}

.pagination button:disabled {
  background: #b8b0a8;
  cursor: not-allowed;
  box-shadow: none;
}

/* ===============================
   RESPONSIVE
   =============================== */

@media (max-width: 600px) {
  .title {
    font-size: 1.9rem;
  }

  .catalog {
    padding: 1.6rem 1.2rem;
  }
}

.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;

  background: #1a3d2a;
  color: #4caf7d;

  border: 1px solid #2d6645;
  border-radius: 10px;

  padding: 12px 18px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;

  box-shadow: 0 10px 25px rgba(0,0,0,0.3);

  animation: fadeInUp 0.3s ease;
  z-index: 999;
}
</style>