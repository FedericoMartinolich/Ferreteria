<template>
  <section class="features-section full-width">
    <div class="features-grid">

      <div class="feature-card">
        <i class="fas fa-credit-card"></i>
        <span class="feature-title">MEDIOS DE PAGO</span>
        <p class="feature-text">
          Aceptamos tarjetas, transferencias y pagos en efectivo.
        </p>
      </div>

      <div class="feature-card">
        <i class="fas fa-truck"></i>
        <span class="feature-title">ENVÍOS A TODA LA CIUDAD</span>
        <p class="feature-text">
          Rápidos y seguros. También podés retirar tu compra en tienda.
        </p>
      </div>

      <div class="feature-card">
        <i class="fas fa-headset"></i>
        <span class="feature-title">ATENCIÓN PERSONALIZADA</span>
        <p class="feature-text">
          Te asesoramos en todo momento para que encuentres exactamente lo que necesitás.
        </p>
      </div>

    </div>
  </section>
</template>

<style scoped>
.full-width {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
}

.features-section {
  background: #ac9780;
  padding: 2rem 0rem;
}

.features-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  background: transparent;
  text-align: center;
  padding: 1rem;
  max-width: 300px;
}

.feature-card i {
  font-size: 2rem;
  color: #111;
  margin-bottom: 1rem;
}

.feature-title {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #111;
}

.feature-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

/* Tablet */
@media (max-width: 900px) {
  .features-grid {
    display: grid;
    grid-template-columns: 1fr;
  }
  .feature-card {
    max-width: 300px;
    margin: auto;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .features-section {
    padding: 3rem 1rem;
  }

  .feature-card i {
    font-size: 1.7rem;
  }

  .feature-title {
    font-size: 1rem;
  }

  .feature-text {
    font-size: .92rem;
  }
}
</style>