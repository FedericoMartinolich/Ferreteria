<template>
  <section class="about-wrapper">
    <div class="about-card">
      
      <div class="image-wrapper">
        <img src="../assets/imgs/local.jpg" alt="Ferretería El Moro" />
        <div class="image-overlay"></div>
      </div>

      <div class="about-content">
        <h1>¿Quiénes Somos?</h1>
        <div class="divider"></div>

        <p>
          <strong>Ferretería El Moro</strong> es una empresa familiar dedicada a la
          venta de herramientas manuales y eléctricas, artículos para el
          mantenimiento de piletas y jardines, pinturas, sanitarios, hornos,
          asadores, planchetas, discos paelleros y anexos.
        </p>

        <p>
          Nos distinguimos por el buen trato, la atención personalizada y el
          ambiente familiar que se genera tanto con nuestros clientes como
          dentro del equipo de trabajo.
        </p>
      </div>

    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
/* =========================
   WRAPPER
========================= */
.about-wrapper {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
}

/* =========================
   CARD
========================= */
.about-card {
  background: #f4efe8;
  max-width: 900px;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0,0,0,.45);
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* =========================
   IMAGE
========================= */
.image-wrapper {
  position: relative;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0,0,0,.55),
    rgba(0,0,0,.1)
  );
}

/* =========================
   CONTENT
========================= */
.about-content {
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.about-content h1 {
  font-size: 2.3rem;
  color: #4b2e1f;
  margin-bottom: .6rem;
  letter-spacing: 1px;
}

.divider {
  margin: 0 auto;
  width: 90px;
  height: 4px;
  background: linear-gradient(135deg, #c47a3a, #a8642e);
  margin-bottom: 1.8rem;
  border-radius: 2px;
}

.about-content p {
  font-size: 1.05rem;
  color: #3a2a1a;
  line-height: 1.8;
  margin-bottom: 1.3rem;
}

.about-content strong {
  color: #2a1a0f;
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 900px) {
  .about-card {
    grid-template-columns: 1fr;
  }

  .image-wrapper {
    height: 260px;
  }

  .about-content {
    padding: 2.2rem 1.8rem;
    text-align: center;
  }

  .divider {
    margin: 0 auto 1.5rem;
  }
}

@media (max-width: 420px) {
  .about-content h1 {
    font-size: 1.9rem;
  }

  .about-content p {
    font-size: 1rem;
  }
}
</style>
