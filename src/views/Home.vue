<template>
  <div>
    <h1>Productos destacados</h1>

    <h1>Nuevas incorporaciones</h1>
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
