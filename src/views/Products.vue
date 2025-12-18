<template>
  <div>
    <h1>Catálogo de Ferretería</h1>

    <input
      v-model="search"
      placeholder="Buscar producto..."
      class="search-input"
    />

    <div class="container">
      <div
        v-for="p in paginatedProducts"
        :key="p.id"
      >
        <router-link :to="`/ProductDetail/${p.id}`" class="product-link">
          <ProductCard :price="p.price" :product="p.product" />
        </router-link>
      </div>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">❮</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">❯</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getProducts } from "../services/products.js";
import ProductCard from "../components/ProductCard.vue";

const products = ref([]);
const search = ref("");
const currentPage = ref(1);
const pageSize = 30; // Number of products per page

onMounted(async () => {
  products.value = await getProducts();
});

const filteredProducts = computed(() =>
  products.value.filter((p) =>
    p.product.toLowerCase().includes(search.value.toLowerCase())
  )
);

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProducts.value.slice(start, start + pageSize);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.product-card {
  background: var(--llave);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.288);
}

.product-card:hover,
.product-card:focus {
  background: #7972609f;
  transform: translateY(-4px);
  color: #fff;
  transition: all 0.3s ease;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 8px 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
.product-link {
  text-decoration: none;
  color: inherit;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin: 2rem;
}
.pagination button {
  margin: 0 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>