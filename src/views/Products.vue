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

/* Filtro */
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.product.toLowerCase().includes(search.value.toLowerCase())
  )
);

/* Paginación */
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / pageSize)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProducts.value.slice(start, start + pageSize);
});

/* Navegación */
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

/* Reset página al buscar */
watch(search, () => {
  currentPage.value = 1;
});

const toast = ref(null)
const showToast = ref(false)

onMounted(() => {
  const raw = localStorage.getItem('toast')

  if (raw) {
    const data = JSON.parse(raw)

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
  max-width: 1100px;
  margin: 0 auto 2rem;
  padding: 2.2rem 1.6rem;
  background: rgba(243, 237, 228, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
}

/* ===============================
   TÍTULO
   =============================== */

.title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #3b2a1d;
  letter-spacing: 0.5px;
}

.title i {
  margin-right: 0.5rem;
  color: #c46a2b;
}

/* ===============================
   BUSCADOR
   =============================== */

.search-wrapper {
  position: relative;
  max-width: 440px;
  margin: 0 auto 2rem;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  font-size: 15px;
  border-radius: 10px;
  border: 2px solid #d4c4b0;
  background: #ffffff;
  color: #3b2a1d;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input::placeholder {
  color: #9c8573;
}

.search-input:focus {
  outline: none;
  border-color: #c46a2b;
  box-shadow: 0 0 0 3px rgba(196, 106, 43, 0.2);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #9c8573;
  font-size: 15px;
  pointer-events: none;
}

/* ===============================
   GRID DE PRODUCTOS
   =============================== */

.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.2rem;
}

/* ===============================
   LINKS
   =============================== */

.product-link {
  text-decoration: none;
  color: inherit;
  display: flex;
}

/* ===============================
   PAGINACIÓN
   =============================== */

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin: 2.5rem 0 1rem;
  font-size: 14px;
  color: #5a4a3d;
}

.pagination span {
  font-weight: 500;
}

.pagination button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #c46a2b, #a85722);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(196, 106, 43, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pagination button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(196, 106, 43, 0.4);
}

.pagination button:disabled {
  background: #c4b8a8;
  cursor: not-allowed;
  box-shadow: none;
}

/* ===============================
   RESPONSIVE
   =============================== */

@media (max-width: 768px) {
  .catalog {
    padding: 1.5rem 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  .title {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }

  .container {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }

  .pagination {
    gap: 1rem;
  }
}

/* ===============================
   TOAST
   =============================== */

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
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  animation: fadeInUp 0.3s ease;
  z-index: 999;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
