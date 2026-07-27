<template>
  <section class="about-wrapper">
    <div class="about-card">

      <div class="image-wrapper">
        <img src="../assets/imgs/local.jpg" :alt="`Local de ${nombre || 'Ferretería El Moro'}`" />
        <div class="image-overlay"></div>
        <span class="location-badge">Desde Gualeguaychú</span>
      </div>

      <div class="about-content">
        <p class="eyebrow">{{ tituloDecorativo || 'Nuestra historia' }}</p>
        <h1 class="title">{{ tituloPrincipal || '¿Quiénes somos?' }}</h1>
        <div class="divider"></div>

        <p v-if="textos[0]">
          <strong>{{ nombre || 'Ferretería El Moro' }}</strong> {{ textos[0] }}
        </p>

        <p v-if="textos[1]">{{ textos[1] }}</p>

        <p v-if="textos[2]">{{ textos[2] }}</p>

        <div class="pillars" v-if="hasCaracteristicas">
          <div class="pillar" v-for="(car, i) in caracteristicasFiltradas" :key="i">
            <span class="pillar-icon">{{ pillarIcons[i] || '🔧' }}</span>
            <span>{{ car }}</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useConfig } from '../composables/useConfig.js'

const { load: loadConfig, nombre, tituloDecorativo, tituloPrincipal, textos, caracteristicas } = useConfig()

const pillarIcons = ['🤝', '🏠', '🔧']

const caracteristicasFiltradas = computed(() =>
  caracteristicas.value.filter(c => c)
)

const hasCaracteristicas = computed(() => caracteristicasFiltradas.value.length > 0)

onMounted(() => loadConfig())
</script>

<style scoped>

p {
  text-align: left;
}

.about-wrapper {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
}

.about-card {
  background: #f4efe8;
  max-width: 1100px;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0,0,0,.45);
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* IMAGE */
.image-wrapper {
  position: relative;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,.1));
}

.location-badge {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  background: rgba(196, 122, 58, 0.9);
  color: #fff;
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .5px;
  padding: 5px 14px;
  border-radius: 20px;
}

/* CONTENT */
.about-content {
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.eyebrow {
  font-size: .75rem;
  color: #c47a3a;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: .4rem;
}

.about-content h1 {
  font-size: 2.6rem;
  color: #4b2e1f;
  margin-bottom: .5rem;
  letter-spacing: .5px;
  line-height: 1.2;
  text-align: justify;
}

.divider {
  width: 48px;
  height: 4px;
  background: linear-gradient(135deg, #c47a3a, #a8642e);
  margin-bottom: 1.6rem;
  border-radius: 2px;
}

.about-content p {
  font-size: 1rem;
  color: #3a2a1a;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.about-content strong {
  color: #2a1a0f;
}

/* PILLARS */
.pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 1.2rem;
}

.pillar {
  background: rgba(0,0,0,.05);
  border-radius: 10px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: .8rem;
  color: #4b2e1f;
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
}

.pillar-icon {
  font-size: 1.3rem;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .about-card {
    grid-template-columns: 1fr;
  }

  .image-wrapper {
    height: 260px;
  }

  .about-content {
    padding: 2.2rem 1.8rem;
  }
}

@media (max-width: 420px) {
  .about-content h1 {
    font-size: 1.75rem;
  }
}
</style>