<template>
    <footer class="app-footer" role="contentinfo">
        <div class="footer-inner">
            <div class="brand">
                <h1 class="brand-title">Ferretería</h1>
                <p class="brand-sub">Calidad, servicio y experiencia</p>
            </div>

            <nav class="footer-nav" aria-label="Enlaces del pie de página">
                <a href="#" class="footer-link">Inicio</a>
                <a href="#" class="footer-link">Productos</a>
                <a href="#" class="footer-link">Promociones</a>
                <a href="#" class="footer-link">Contacto</a>
            </nav>

            <div class="footer-info">
                <div class="social" aria-hidden="false" aria-label="Redes sociales">
                    <a href="#" class="icon" aria-label="Facebook">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.44 9.9v-7.01H8.08v-2.9h2.22V9.09c0-2.2 1.31-3.42 3.32-3.42.96 0 1.96.17 1.96.17v2.15h-1.1c-1.08 0-1.42.67-1.42 1.36v1.64h2.42l-.39 2.9h-2.03V22c4.78-.77 8.44-4.91 8.44-9.93z"/></svg>
                    </a>
                    <a href="#" class="icon" aria-label="Instagram">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A4.8 4.8 0 1 0 16.8 13 4.8 4.8 0 0 0 12 8.2zm6.5-3.7a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2z"/></svg>
                    </a>
                </div>

                <div class="copyright">
                    <small>&copy; {{ year }} Ferretería. Todos los derechos reservados.</small>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { ref } from 'vue'
const year = ref(new Date().getFullYear())
</script>

<style scoped>
footer {
   width: 100%;
   bottom:0px;
}

.app-footer {
    background: linear-gradient(180deg, #1f2937, #111827);
    color: #e5e7eb;
    padding: 2rem 1rem;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    bottom: 0;
  left: 0;
  height: 20vh;
  width: 100%;
  text-align: center;
  padding: 12px 0;
  backdrop-filter: blur(6px);
  font-size: 14px;
  z-index: 1000;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 0%;
}

.footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 100%;
}

.containter {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.brand {
    min-width: 180px;
}

.brand-title {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
}

.brand-sub {
    margin: 0;
    color: #9ca3af;
    font-size: 0.9rem;
}

.footer-nav {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
}

.footer-link {
    color: #d1d5db;
    text-decoration: none;
    font-size: 0.95rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}
.footer-link:hover,
.footer-link:focus {
    background: rgba(255,255,255,0.04);
    outline: none;
    color: #fff;
}

.footer-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    min-width: 160px;
}

.social {
    display: flex;
    gap: 0.5rem;
}

.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #cbd5e1;
    background: rgba(255,255,255,0.03);
    width: 36px;
    height: 36px;
    border-radius: 8px;
    text-decoration: none;
    transition: background .15s, transform .12s;
}
.icon:hover,
.icon:focus {
    background: rgba(255,255,255,0.06);
    transform: translateY(-2px);
    color: #fff;
}

copyright small {
    color: #9ca3af;
    font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 720px) {
    .footer-inner {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
    .footer-info {
        align-items: flex-start;
    }
}
</style>