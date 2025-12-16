<template>
    <footer class="app-footer" role="contentinfo">
        <div class="footer-inner">
            <div class="brand">
                <h1 class="brand-title">Ferretería - EL MORO</h1>
                <p class="brand-sub">Calidad, servicio y experiencia</p>
            </div>
            <div class="footer-info">
                <div class="social" aria-hidden="false" aria-label="Redes sociales">
                    <a href="https://wa.me/543446670475" class="icon" aria-label="Whatsapp">
                        <i class="fa-brands fa-whatsapp"></i> <p>WhatsApp </p>
                    </a>
                    <a href="https://www.instagram.com/ferreteria.elmoro/" class="icon" aria-label="Instagram">
                        <i class="fa-brands fa-instagram"></i> <p>Instagram </p>
                    </a>
                </div>
                <div class="copyright">
                    <small>&copy; {{ year }} Ferretería - EL MORO. Todos los derechos reservados.</small>
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
    padding: 0 12px;
    font-size: 1rem;
    width: auto;
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
@media (max-width: 1200px) {
    .footer-inner {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        justify-content: center;
    }
    .footer-info {
        align-items: center;
    }
}
</style>