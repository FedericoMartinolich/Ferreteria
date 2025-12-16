<template>
  <div class="search-wrapper">
    <!-- INPUT -->
    <div class="search">
      <input
        v-model="search"
        type="search"
        :placeholder="placeholder"
        aria-label="Buscar"
      />
    </div>

    <!-- RESULTADOS -->
    <div v-if="filteredProducts.length" class="search-results">
      <div
        class="result-item"
        v-for="p in filteredProducts"
        :key="p.id"
      >
        <RouterLink
          :to="`/ProductDetail/${p.id}`"
          class="result-link"
          @click="clearSearch"
        >
          <img
            v-if="p.thumbnail"
            :src="p.thumbnail"
            class="result-thumb"
          />
          <span class="result-title">{{ p.product }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getProducts } from "../services/products.js";

defineProps({
  placeholder: {
    type: String,
    default: "Buscar producto..."
  }
});

const search = ref("");
const products = ref([]);

onMounted(async () => {
  products.value = await getProducts();
});

const filteredProducts = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return [];

  return products.value.filter(p =>
    p.product.toLowerCase().includes(q)
  );
});

const clearSearch = () => {
  search.value = "";
};
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
}

.search input {
  border: 1px solid var(--moro);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  background-color: var(--moro);
  width: 100%;
}

/* reutilizamos tu mismo CSS */
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
}
</style>
