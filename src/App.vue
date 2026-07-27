<template>
  <main>
    <Header :logo="logo" :title="title" :cartCount="cartCount"/>
    <div class="container">
      <RouterView />
    </div>
    <Footer />
  </main>
</template>

<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useConfig } from "./composables/useConfig.js";

const { load: loadConfig, nombre } = useConfig();
const route = useRoute();

const logo = ref("");
const title = ref("EL MORO");
const cart = ref([]);

function readCart() {
  try {
    cart.value = JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    cart.value = [];
  }
}

const cartCount = computed(() =>
  cart.value.reduce((s, i) => s + (Number(i.qty) || 0), 0)
);

watch(() => route.fullPath, readCart);
window.addEventListener("storage", readCart);
window.addEventListener("cart-updated", readCart);

onMounted(async () => {
  readCart();
  await loadConfig();
  if (nombre.value) title.value = nombre.value;

  const month = new Date().getMonth();
  if (month === 11) {
    const module = await import("/perfil-navidad.png");
    logo.value = module.default;
  } else {
    const module = await import("/perfil.png");
    logo.value = module.default;
  }
});
</script>

<style scoped>
.container {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  flex: 1;
  box-sizing: border-box;
}
</style>
