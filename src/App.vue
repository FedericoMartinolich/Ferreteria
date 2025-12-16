<template>
  <main>
    <Header :logo="logo" :title="title"/>
    <div class="container">
      <RouterView />
    </div>
    <Footer />
  </main>
</template>

<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { ref, onMounted } from "vue";

const logo = ref("");

onMounted(async () => {
  const month = new Date().getMonth();

  if (month === 11) {
    const module = await import("/perfil-navidad.png");
    logo.value = module.default;
  } else {
    const module = await import("/perfil.png");
    logo.value = module.default;
  }
});

const title = 'EL MORO'
</script>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 720px;
}
</style>