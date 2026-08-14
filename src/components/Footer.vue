<template>
  <footer class="app-footer" role="contentinfo">
    <div class="footer-inner">
      <!-- SOCIAL LEFT -->
      <div class="social" aria-label="Redes sociales">
        <a v-if="whatsappUrl" :href="whatsappUrl" class="icon" aria-label="WhatsApp">
          <i class="fa-brands fa-whatsapp"></i>
        </a>
        <a v-if="instagram" :href="instagram" class="icon" aria-label="Instagram">
          <i class="fa-brands fa-instagram"></i>
        </a>
      </div>

      <!-- CENTER -->
      <div class="brand">
        <h1 class="brand-title">{{ brandName }}</h1>
        <p class="brand-sub">{{ eslogan }}</p>
      </div>

      <!-- RIGHT -->
      <div class="footer-right">
        <div class="footer-nav">
          <router-link to="/" class="footer-link">Inicio</router-link>
          <router-link to="/products" class="footer-link">Productos</router-link>
          <router-link to="/contact" class="footer-link">Contacto</router-link>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <small>&copy; {{ year }} {{ brandName }}. Todos los derechos reservados.</small>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfig } from '../composables/useConfig.js'

const { load: loadConfig, nombre, eslogan, tipoNegocio, whatsappUrl, instagram } = useConfig()
const year = ref(new Date().getFullYear())

const brandName = computed(() => {
  const parts = [tipoNegocio.value, nombre.value].filter(Boolean)
  return parts.join(' - ') || 'Catálogo Comercial'
})

onMounted(() => loadConfig())
</script>

<style scoped>
.app-footer {
  background: var(--navy);
  color: var(--white);
  width: 100%;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.8rem 1.5rem;
  gap: 2rem;
}

/* SOCIAL */
.social {
  display: flex;
  gap: 0.6rem;
  flex-shrink: 0;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  font-size: 1.1rem;
  text-decoration: none;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}

.icon:hover {
  background: var(--orange);
  color: var(--white);
  transform: translateY(-2px);
}

/* BRAND */
.brand {
  text-align: center;
  flex: 1;
}

.brand-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--white);
}

.brand-sub {
  margin: 0;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;
}

/* NAV */
.footer-nav {
  display: flex;
  gap: 0.5rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--white);
}

/* BOTTOM */
.footer-bottom {
  text-align: center;
  padding: 0.8rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.8rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .footer-inner {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 1rem;
  }

  .footer-nav {
    gap: 0.4rem;
  }
}
</style>
