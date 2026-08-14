<template>
  <section class="features-section">
    <div class="features-grid">

      <div class="feature-card">
        <div class="icon-wrapper">
          <i class="fas fa-credit-card"></i>
        </div>
        <span class="feature-title">MEDIOS DE PAGO</span>
        <p class="feature-text">
          Aceptamos tarjetas, transferencias y pagos en efectivo.
        </p>
      </div>

      <div class="feature-card">
        <div class="icon-wrapper">
          <i class="fas fa-truck"></i>
        </div>
        <span class="feature-title">ENVÍOS A TODA LA CIUDAD</span>
        <p class="feature-text">
          Rápidos y seguros. También podés retirar tu compra en tienda.
        </p>
      </div>

      <div class="feature-card">
        <div class="icon-wrapper">
          <i class="fas fa-headset"></i>
        </div>
        <span class="feature-title">ATENCIÓN PERSONALIZADA</span>
        <p class="feature-text">
          Te asesoramos en todo momento para que encuentres exactamente lo que necesitás.
        </p>
      </div>

    </div>
  </section>
</template>

<style scoped>
.features-section {
  background: linear-gradient(135deg, var(--gray-100), var(--gray-50));
  padding: 2.5rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
  border-radius: var(--radius-4xl);
  box-shadow: var(--shadow-sm);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  background: var(--white);
  text-align: center;
  padding: 1.8rem 1.2rem;
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-xs);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: var(--navy);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card i {
  font-size: 1.4rem;
  color: var(--white);
}

.feature-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: 0.03em;
  margin-bottom: 0.5rem;
}

.feature-text {
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--gray-600);
  margin: 0;
}

/* Tablet */
@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .feature-card {
    max-width: 320px;
    margin: 0 auto;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .features-section {
    padding: 1.5rem 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  .feature-card {
    padding: 1.2rem 1rem;
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .feature-card i {
    font-size: 1.2rem;
  }

  .feature-title {
    font-size: 0.8rem;
  }

  .feature-text {
    font-size: 0.78rem;
  }
}
</style>
