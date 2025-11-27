<template>
  <div>
    <h1>Catálogo de Ferretería</h1>

    <input
      v-model="search"
      placeholder="Buscar producto..."
      style="padding: 8px; margin: 10px 0; width: 300px;"
    />

    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;">
      
      <div
        v-for="p in filteredProducts"
        :key="p.product"
        style="border: 1px solid #ccc; padding: 10px; border-radius: 8px;"
      >
        <h3>{{ p.product }}</h3>
        <strong>${{ p.price }}</strong>
        <p v-if="p.categoria">Categoría: {{ p.categoria }}</p>

        <img
          v-if="p.img"
          :src="p.img"
          style="width: 100%; border-radius: 6px; margin-top: 10px;"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getProducts } from "../services/products.js";

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