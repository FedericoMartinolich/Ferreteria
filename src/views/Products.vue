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
        v-for="p in filteredProducts"
        :key="p.id" 
        >
          <router-link :to="`/ProductDetail/${p.id}`" class="product-link">
            <ProductCard :price="p.price" :product="p.product" />
          </router-link>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getProducts } from "../services/products.js";
import  ProductCard  from "../components/ProductCard.vue";

const products = ref([]);
const search = ref("");

onMounted(async () => {
  products.value = await getProducts();
});

const filteredProducts = computed(() =>
  products.value.filter((p) =>
    p.product.toLowerCase().includes(search.value.toLowerCase())
  )
);
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
</style>