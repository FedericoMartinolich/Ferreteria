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

              <li class="list-item">
                <a href="https://wa.me/543446670475" target="_blank">
                  <i class="fa fa-brands fa-whatsapp fa-2x"></i>
                  (54) 3446 67-0475
                </a>
              </li>

              <li class="list-item">
                <span>
                  <i class="fa fa-calendar fa-2x"></i>
                  Lunes a Sábados
                </span>
              </li>

              <li class="list-item">
                <span>
                  <i class="fa fa-clock fa-2x"></i>
                  9hs - 13hs y 16:30hs - 21hs
                </span>
              </li>
            </ul>

            <hr />
            <ul class="social-media-list">
            <li>
              <a href="mailto:elmoroferreteria@gmail.com" target="_blank" class="contact-icon"
                ><i class="fa fa-envelope fa-2x"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/ferreteria.elmoro/" target="_blank" class="contact-icon"
                ><i class="fa fa-brands fa-instagram fa-2x"></i
              ></a>
            </li>
          </ul>
          <hr />

            <div class="copyright">
              © El Moro - Ferretería
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
import { ref, onMounted } from "vue";
import emailjs from "emailjs-com";
import L from "leaflet";

const form = ref(null);
const msg = ref("");

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

onMounted(() => {
  const map = L.map("map", { attributionControl: false })
    .setView([-33.001651, -58.518268], 15);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  L.marker([-33.001651, -58.518268])
    .addTo(map)
    .bindPopup("El Moro - Gualeguaychú")
    .openPopup();
});
</script>


<style scoped>
.contact-view {
  background: linear-gradient(135deg, #2b1e16, #3a2a20);
  color: #f5f5f5;
  padding: 60px 20px;
}

.section-header {
  text-align: center;
  font-size: 42px;
  letter-spacing: 5px;
  margin-bottom: 40px;
  color: #ffd966;
}

/* TARJETA */
.contact-card {
  background: #4a3427;
  border-radius: 16px;
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
}

.contact-wrapper {
  display: flex;
  gap: 60px;
}

.contact-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-form input,
.contact-form textarea {
  background: #2f2f2f;
  border: 1px solid #6b4b3a;
  color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #cfcfcf;
}

/* BOTÓN */
.send-button {
  background: linear-gradient(135deg, #f2c94c, #d4a82a);
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: #2b1e16;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover {
  background: linear-gradient(135deg, #ffd966, #f2c94c);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(242, 201, 76, 0.4);
}

.form-msg {
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
  color: #cfcfcf;
}

/* CONTACTO */
.direct-contact-container {
  max-width: 360px;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.list-item {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  color: #cfcfcf;
}

.list-item a, span, i {
  color: #ffd966;
  text-decoration: none;
}

.list-item a:hover {
  color: #f2c94c;
}

/* Redes sociales */
.social-media-list {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 0;
}

.social-media-list li {
  list-style: none;
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  background: #2f2f2f;
  border-radius: 50%;
  color: #ffd966;
  transition: all 0.3s ease;
}

.contact-icon:hover {
  background: #f2c94c;
  color: #2b1e16;
  transform: scale(1.15);
}

/* FOOTER */
.copyright {
  text-align: center;
  color: #9e9e9e;
  margin-top: 20px;
  font-size: 14px;
}

/* MAPA */
.map-wrapper {
  margin-top: 50px;
  max-width: 1100px;
  margin-inline: auto;
  border-radius: 16px;
  overflow: hidden;
  border: 4px solid #6b4b3a;
}

#map {
  width: 100%;
  height: 350px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .section-header {
    font-size: 32px;
    letter-spacing: 3px;
  }

  .contact-card {
    padding: 25px;
  }

  .contact-wrapper {
    flex-direction: column;
    gap: 40px;
    align-items: center;
  }

  .contact-form {
    width: 100%;
  }

  .contact-form input,
  .contact-form textarea {
    font-size: 14px;
  }

  .send-button {
    width: 100%;
    padding: 14px;
    font-size: 15px;
  }

  .direct-contact-container {
    max-width: 100%;
    width: 100%;
    text-align: center;
  }

  .contact-list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .list-item {
    justify-content: center;
    text-align: center;
    gap: 10px;
  }

  .list-item i {
    font-size: 20px;
  }

  .social-media-list {
    margin-top: 20px;
  }

  .map-wrapper {
    margin-top: 30px;
  }

  #map {
    height: 250px;
  }
}

@media (max-width: 420px) {
  .section-header {
    font-size: 26px;
  }

  .contact-card {
    padding: 20px;
  }

  .list-item {
    flex-direction: column;
  }

  .list-item span,
  .list-item a {
    font-size: 14px;
  }
}

</style>
