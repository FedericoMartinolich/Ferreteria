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
import { useConfig } from "./composables/useConfig.js";

const { load: loadConfig, nombre } = useConfig();

const logo = ref("");
const title = ref("EL MORO");

onMounted(async () => {
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
}
</style>
