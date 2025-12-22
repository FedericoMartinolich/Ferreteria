<template>
  <div class="about-wrapper">
    <div class="about">
      <img src="../assets/imgs/local.jpg" alt="Ferretería El Moro">
      <h1>¿Quiénes Somos?</h1>
      <div class="divider"></div>
      <p>
        Ferretería El Moro es una empresa familiar dedicada a la venta de
        herramientas manuales, herramientas eléctricas, artículos para
        mantenimiento de piletas y jardines, pinturas, sanitarios, hornos,
        asadores, planchetas, discos paelleros y anexos.
      </p>
      <p>
        Nos distinguimos por el buen trato a nuestros clientes y el ambiente
        familiar que se genera en el grupo de trabajo.
      </p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-wrapper {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}

/* Card */
.about {
  background: rgba(243, 237, 228, 0.95); /* tono cálido */
  max-width: 800px;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  text-align: center;
}

/* Imagen */
img {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem;
  display: block;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

/* Título */
h1 {
  font-size: 2.2rem;
  color: #4b2e1f; /* marrón oscuro */
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

/* Línea decorativa */
.divider {
  width: 80px;
  height: 4px;
  background-color: #c47a3a; /* cobre/madera */
  margin: 0 auto 1.5rem;
  border-radius: 2px;
}

/* Texto */
p {
  font-size: 1.05rem;
  color: #3a2a1a;
  line-height: 1.8;
  margin-bottom: 1.2rem;
}
</style>
