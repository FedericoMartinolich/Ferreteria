<template>
  <main>
    <Header :logo="logo" />
    <div class="container">
      <RouterView />
    </div>
    <Footer />
  </main>
</template>

<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import logo from "/logo.png";
</script>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 720px;
}
</style>