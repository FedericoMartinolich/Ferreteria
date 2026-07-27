<template>
  <div class="search-wrapper" ref="wrapperRef">
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getProducts } from "../services/products.js";

defineProps({
  placeholder: {
    type: String,
    default: "Buscar producto..."
  }
});

const search = ref("");
const products = ref([]);
const wrapperRef = ref(null);

onMounted(async () => {
  products.value = await getProducts();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const filteredProducts = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return [];

  return products.value.filter(p =>
    p.product.toLowerCase().includes(q)
  );
});

const clearSearch = () => {
  setTimeout(() => {
    search.value = "";
  }, 100);
};

const handleClickOutside = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    search.value = "";
  }
};
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
}

.search input {
  border: none;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  background-color: var(--gray-100);
  color: var(--gray-800);
  width: 100%;
}

.search input::placeholder {
  color: var(--gray-400);
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  padding: 0.5rem 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.result-item {
  display: flex;
  align-items: stretch;
  padding: 0;
  cursor: pointer;
}

.result-item:hover {
  background: var(--gray-100);
}

.result-link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
  width: 100%;
  padding: 0.55rem 1rem;
}

.result-thumb {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  object-fit: cover;
}

.result-title {
  color: var(--gray-800);
  font-size: 0.9rem;
}
</style>
