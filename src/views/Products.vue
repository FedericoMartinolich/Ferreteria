<template>
  <NewProducts v-if="newProductsEvent" :data="newProductsEvent" />

  <section class="catalog">
    <template v-if="loading">
      <h1 class="title">
        <i class="fas fa-boxes-stacked"></i>
        {{ catalogTitle }}
      </h1>
      <div class="search-wrapper skeleton-search">
        <div class="skeleton-line"></div>
      </div>
      <div class="container">
        <div v-for="n in 8" :key="n" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-text skeleton-text-title"></div>
          <div class="skeleton-text skeleton-text-sub"></div>
          <div class="skeleton-text skeleton-text-price"></div>
        </div>
      </div>
    </template>

    <template v-else>
      <h1 class="title">
        <i class="fas fa-boxes-stacked"></i>
        {{ catalogTitle }}
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
    </template>
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
import { useConfig } from "../composables/useConfig.js";

import ProductCard from "../components/ProductCard.vue";
import NewProducts from "../components/Div/NewProducts.vue";

const { load: loadConfig, tipoNegocio } = useConfig();

const products = ref([]);
const newProductsEvent = ref(null);
const loading = ref(true);

const catalogTitle = computed(() => {
  const rubro = tipoNegocio.value.trim();
  return rubro ? `Catálogo de ${rubro}` : 'Catálogo';
});

const search = ref("");
const currentPage = ref(1);
const pageSize = 32;

onMounted(async () => {
  try {
    const [productsData, newProductsData] = await Promise.all([
      getProducts(),
      getNewProductsEvent(),
      loadConfig()
    ]);

    products.value = productsData;
    newProductsEvent.value = newProductsData[0] || null;
  } finally {
    loading.value = false;
  }
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
  margin: 0 auto 0;
  padding: 2.2rem 1.6rem;
  background: var(--white);
  box-shadow: var(--shadow-sm);
  box-sizing: border-box;
}

/* ===============================
   TÍTULO
   =============================== */

.title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: var(--navy);
  letter-spacing: 0.5px;
}

.title i {
  margin-right: 0.5rem;
  color: var(--orange);
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
  border-radius: var(--radius-xl);
  border: 2px solid var(--gray-200);
  background: var(--white);
  color: var(--gray-800);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--gray-400);
}

.search-input:focus {
  outline: none;
  border-color: var(--orange);
  box-shadow: 0 0 0 3px rgba(232, 106, 16, 0.15);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: var(--gray-400);
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
  color: var(--gray-600);
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
  background: var(--navy);
  color: var(--white);
  font-size: 16px;
  cursor: pointer;
  box-shadow: var(--shadow-navy-xs);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pagination button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-navy-md);
}

.pagination button:disabled {
  background: var(--gray-200);
  color: var(--gray-400);
  cursor: not-allowed;
  box-shadow: none;
}

/* ===============================
   RESPONSIVE
   =============================== */

@media (max-width: 768px) {
  .catalog {
    padding: 1.5rem 1rem;
    margin-left: 0;
    margin-right: 0;
  }

  .title {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }

  .search-input {
    font-size: 14px;
    padding: 10px 14px 10px 40px;
  }

  .search-icon {
    left: 14px;
    font-size: 14px;
  }

  .container {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.8rem;
  }

  .pagination button {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .catalog {
    padding: 1rem 0.75rem;
  }

  .container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }

  .search-input {
    font-size: 13px;
    padding: 9px 12px 9px 36px;
    border-radius: var(--radius-lg);
  }

  .search-icon {
    left: 12px;
    font-size: 13px;
  }

  .pagination {
    gap: 1rem;
  }

  .pagination span {
    font-size: 12px;
  }
}

/* ===============================
   SKELETON LOADING
   =============================== */

.skeleton-search {
  pointer-events: none;
  margin-bottom: 2rem;
}

.skeleton-line {
  width: 100%;
  height: 44px;
  border-radius: var(--radius-xl);
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-card {
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: var(--white);
  box-shadow: var(--shadow-xs);
  padding: 0;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-text {
  height: 14px;
  margin: 12px 14px 0;
  border-radius: var(--radius-md);
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-text-title {
  width: 70%;
  height: 16px;
}

.skeleton-text-sub {
  width: 50%;
}

.skeleton-text-price {
  width: 35%;
  height: 20px;
  margin-bottom: 14px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ===============================
   TOAST
   =============================== */

.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: var(--navy);
  color: var(--white);
  border: 1px solid var(--navy-light);
  border-radius: var(--radius-xl);
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  box-shadow: var(--shadow-xl);
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
