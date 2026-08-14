<template>
  <main class="contact-view">
    <section id="contact">
      <h1 class="section-header">Contacto</h1>

      <!-- TARJETA -->
      <div class="contact-card">
        <div class="contact-wrapper">
          <!-- Formulario -->
          <form ref="form" @submit.prevent="sendEmail" class="contact-form">
            <input type="text" placeholder="NOMBRE" name="name" required />
            <input type="email" placeholder="EMAIL" name="reply_to" required />
            <input type="text" placeholder="ASUNTO" name="title" required />
            <textarea rows="6" placeholder="MENSAJE" name="message" required></textarea>

            <button type="submit" class="send-button">
              <i class="fa fa-paper-plane"></i> ENVIAR
            </button>

            <p class="form-msg">{{ msg }}</p>
          </form>

          <!-- Datos -->
          <div class="direct-contact-container">
            <ul class="contact-list">
              <li class="list-item" v-if="direccion">
                <span><i class="fa fa-map-marker fa-2x"></i> {{ direccion }}</span>
              </li>

              <li class="list-item" v-if="whatsappUrl">
                <a :href="whatsappUrl" target="_blank">
                  <i class="fa fa-brands fa-whatsapp fa-2x"></i>
                  {{ whatsappDisplay }}
                </a>
              </li>

              <li class="list-item" v-if="diasAtencion">
                <span>
                  <i class="fa fa-calendar fa-2x"></i>
                  {{ diasAtencion }}
                </span>
              </li>

              <li class="list-item" v-if="horasAtencion">
                <span>
                  <i class="fa fa-clock fa-2x"></i>
                  {{ horasAtencion }}
                </span>
              </li>
            </ul>

            <hr />
            <ul class="social-media-list">
            <li v-if="mailtoUrl">
              <a :href="mailtoUrl" target="_blank" class="contact-icon"
                ><i class="fa fa-envelope fa-2x"></i>
              </a>
            </li>
            <li v-if="instagram">
              <a :href="instagram" target="_blank" class="contact-icon"
                ><i class="fa fa-brands fa-instagram fa-2x"></i
              ></a>
            </li>
          </ul>
          <hr />

            <div class="copyright">
              © {{ brandName }}
            </div>
          </div>
        </div>
      </div>

      <!-- MAPA -->
      <div v-if="showMap" class="map-wrapper">
        <div id="map"></div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import emailjs from "emailjs-com";
import L from "leaflet";
import { useConfig } from '../composables/useConfig.js'
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY
} from '../config/emailjs.js'

const { load: loadConfig, whatsapp, whatsappUrl, email: configEmail, mailtoUrl, instagram, nombre, tipoNegocio, coordenadas, direccion, diasAtencion, horasAtencion } = useConfig()

const form = ref(null);
const msg = ref("");
const showMap = ref(false);

const brandName = computed(() => {
  const parts = [tipoNegocio.value, nombre.value].filter(Boolean)
  return parts.join(' - ') || 'Catálogo Comercial'
})

const whatsappDisplay = computed(() => {
  const raw = whatsapp.value || '';
  const clean = raw.replace(/^549?/, '');
  return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)} ${raw.slice(6)}`;
});

const sendEmail = () => {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    msg.value = "El formulario no está configurado.";
    return;
  }

  msg.value = "Enviando...";

  emailjs.sendForm(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    form.value,
    EMAILJS_PUBLIC_KEY
  )
  .then(() => {
    msg.value = "Mensaje enviado correctamente ✔";
    form.value.reset();
  })
  .catch(() => {
    msg.value = "Error al enviar ❌";
  });
};

onMounted(async () => {
  await loadConfig();

  const coords = coordenadas.value;
  if (!coords) return;

  showMap.value = true;
  await nextTick();

  const map = L.map("map", { attributionControl: false })
    .setView([coords.lat, coords.lng], 15);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  L.marker([coords.lat, coords.lng])
    .addTo(map)
    .bindPopup(brandName.value)
    .openPopup();
});
</script>


<style scoped>
/* =========================
   VISTA GENERAL
   ========================= */

.contact-view {
  background: var(--navy);
  color: var(--white);
  padding: 70px 20px;
  box-sizing: border-box;
  width: 100%;
}

/* =========================
   TÍTULO
   ========================= */

.section-header {
  text-align: center;
  font-size: 42px;
  letter-spacing: 6px;
  margin-bottom: 45px;
  color: var(--yellow);
  font-weight: 600;
}

/* =========================
   TARJETA PRINCIPAL
   ========================= */

.contact-card {
  background: var(--navy-light);
  border-radius: var(--radius-5xl);
  padding: 42px;
  max-width: 1000px;
  margin: 0 auto;
  box-shadow: var(--shadow-lg);
}

.contact-wrapper {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

/* =========================
   FORMULARIO
   ========================= */

.contact-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.contact-form input,
.contact-form textarea {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--white);
  padding: 12px 14px;
  border-radius: var(--radius-xl);
  font-size: 14px;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--yellow);
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2);
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

/* =========================
   BOTÓN ENVIAR
   ========================= */

.send-button {
  margin-top: 8px;
  background: var(--yellow);
  border: none;
  border-radius: var(--radius-xl);
  padding: 14px;
  color: var(--navy);
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover {
  background: var(--yellow-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-yellow-md);
}

.form-msg {
  text-align: center;
  font-size: 14px;
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* =========================
   CONTACTO DIRECTO
   ========================= */

.direct-contact-container {
  max-width: 360px;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
}

.list-item i {
  color: var(--yellow);
}

.list-item a,
.list-item span {
  color: var(--yellow);
  text-decoration: none;
  transition: color 0.2s ease;
}

.list-item a:hover {
  color: var(--yellow-light);
}

/* =========================
   REDES SOCIALES
   ========================= */

.social-media-list {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 0;
  margin: 20px 0;
}

.social-media-list li {
  list-style: none;
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  color: var(--yellow);
  transition: all 0.3s ease;
}

.contact-icon:hover {
  background: var(--yellow);
  color: var(--navy);
  transform: scale(1.15);
}

/* =========================
   FOOTER
   ========================= */

.copyright {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 20px;
  font-size: 13px;
}

/* =========================
   MAPA
   ========================= */

.map-wrapper {
  margin-top: 55px;
  max-width: 1100px;
  margin-inline: auto;
  border-radius: var(--radius-5xl);
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.12);
  box-shadow: var(--shadow-lg);
}

#map {
  width: 100%;
  height: 350px;
}

/* =========================
   RESPONSIVE
   ========================= */

@media (max-width: 768px) {
  .section-header {
    font-size: 32px;
    letter-spacing: 3px;
  }

  .contact-card {
    padding: 28px;
  }

  .contact-wrapper {
    flex-direction: column;
    gap: 40px;
    align-items: center;
  }

  .contact-form {
    width: 100%;
  }

  .send-button {
    width: 100%;
    padding: 15px;
  }

  .direct-contact-container {
    max-width: 100%;
    text-align: center;
  }

  .contact-list {
    align-items: center;
  }

  .list-item {
    justify-content: center;
    text-align: center;
  }

  #map {
    height: 260px;
  }
}

@media (max-width: 420px) {
  .section-header {
    font-size: 26px;
  }

  .contact-card {
    padding: 22px;
  }

  .list-item {
    flex-direction: column;
    gap: 6px;
  }

  .list-item span,
  .list-item a {
    font-size: 14px;
  }
}
</style>
