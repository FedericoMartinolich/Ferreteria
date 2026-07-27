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
              <li class="list-item">
                <span><i class="fa fa-map-marker fa-2x"></i> Gualeguaychú, Entre Ríos, Argentina</span>
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
              © {{ nombre || 'El Moro' }} - Ferretería
            </div>
          </div>
        </div>
      </div>

      <!-- MAPA -->
      <div class="map-wrapper">
        <div id="map"></div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import emailjs from "emailjs-com";
import L from "leaflet";
import { useConfig } from '../composables/useConfig.js'

const { load: loadConfig, whatsapp, whatsappUrl, email: configEmail, mailtoUrl, instagram, nombre, coordenadas, diasAtencion, horasAtencion } = useConfig()

const form = ref(null);
const msg = ref("");

const whatsappDisplay = computed(() => {
  const raw = whatsapp.value || '';
  const clean = raw.replace(/^549?/, '');
  return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)} ${raw.slice(6)}`;
});

const sendEmail = () => {
  msg.value = "Enviando...";

  emailjs.sendForm(
    "service_0mexqa8",
    "template_1f1ml7k",
    form.value,
    "epWXTcHwVSD3VGOWW"
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

  const coords = coordenadas.value || { lat: -33.001651, lng: -58.518268 };

  const map = L.map("map", { attributionControl: false })
    .setView([coords.lat, coords.lng], 15);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  L.marker([coords.lat, coords.lng])
    .addTo(map)
    .bindPopup(`${nombre.value || 'El Moro'} - Gualeguaychú`)
    .openPopup();
});
</script>


<style scoped>
/* =========================
   VISTA GENERAL
   ========================= */

.contact-view {
  background: linear-gradient(135deg, #2b1e16, #3a2a20);
  color: #f5f5f5;
  padding: 70px 20px;
}

/* =========================
   TÍTULO
   ========================= */

.section-header {
  text-align: center;
  font-size: 42px;
  letter-spacing: 6px;
  margin-bottom: 45px;
  color: #e6c87a;
  font-weight: 600;
}

/* =========================
   TARJETA PRINCIPAL
   ========================= */

.contact-card {
  background: linear-gradient(180deg, #4a3427, #3d2b20);
  border-radius: 18px;
  padding: 42px;
  max-width: 1000px;
  margin: 0 auto;
  box-shadow:
    0 15px 45px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
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
  background: #2a1f18;
  border: 1px solid #7a5a45;
  color: #f5f5f5;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14px;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #e6c87a;
  box-shadow: 0 0 0 2px rgba(230, 200, 122, 0.25);
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #c9b8aa;
  letter-spacing: 1px;
}

/* =========================
   BOTÓN ENVIAR
   ========================= */

.send-button {
  margin-top: 8px;
  background: linear-gradient(135deg, #f2c94c, #d4a82a);
  border: none;
  border-radius: 10px;
  padding: 14px;
  color: #2b1e16;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover {
  background: linear-gradient(135deg, #ffd966, #f2c94c);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(242, 201, 76, 0.45);
}

.form-msg {
  text-align: center;
  font-size: 14px;
  margin-top: 12px;
  color: #d6c6b8;
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
  color: #e0d2c4;
  font-size: 15px;
}

.list-item i {
  color: #e6c87a;
}

.list-item a,
.list-item span {
  color: #e6c87a;
  text-decoration: none;
  transition: color 0.2s ease;
}

.list-item a:hover {
  color: #ffd966;
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
  background: #2a1f18;
  border-radius: 50%;
  color: #e6c87a;
  box-shadow: inset 0 0 0 1px #7a5a45;
  transition: all 0.3s ease;
}

.contact-icon:hover {
  background: #f2c94c;
  color: #2b1e16;
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(242, 201, 76, 0.5);
}

/* =========================
   FOOTER
   ========================= */

.copyright {
  text-align: center;
  color: #b7a89a;
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
  border-radius: 18px;
  overflow: hidden;
  border: 4px solid #7a5a45;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
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
