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
                <i class="fa fa-map-marker fa-2x"></i>
                <span>Gualeguaychú, Entre Ríos, Argentina</span>
              </li>

              <li class="list-item">
                <i class="fa fa-brands fa-whatsapp fa-2x"></i>
                <a href="https://wa.me/543446670475" target="_blank">
                  (54) 3446 67-0475
                </a>
              </li>

              <li class="list-item">
                <i class="fa fa-calendar fa-2x"></i>
                <a href="mailto:elmoroferreteria@gmail.com">
                  Lunes a Sábados
                </a>
              </li>

              <li class="list-item">
                <i class="fa fa-clock fa-2x"></i>
                <a href="mailto:elmoroferreteria@gmail.com">
                  9hs - 13hs y 16:30hs - 21hs
                </a>
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
              <a href="https://github.com/FedericoMartinolich" target="_blank" class="contact-icon"
                ><i class="fa fa-brands fa-github fa-2x"></i
              ></a>
            </li>
            <li>
              <a href="https://www.instagram.com/fedev.jpg" target="_blank" class="contact-icon"
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
  background: #0e131b;
  color: #fff;
  padding: 60px 20px;
}

.section-header {
  text-align: center;
  font-size: 42px;
  letter-spacing: 5px;
  margin-bottom: 40px;
}

/* TARJETA */
.contact-card {
  background: #141a24;
  border-radius: 16px;
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
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
  background: #1a1f2a;
  border: 1px solid #2b3242;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
}

.send-button {
  background: #007bff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.send-button:hover {
  background: #0056b3;
}

.form-msg {
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
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
  color: #aaa;
}

.list-item a {
  color: #fff;
  text-decoration: none;
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
  background: #1f2633;
  border-radius: 50%;
  color: #fff;
  transition: all 0.3s;
}

.contact-icon:hover {
  background: #007bff;
  transform: scale(1.1);
}

.copyright {
  text-align: center;
  color: #777;
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
}

#map {
  width: 100%;
  height: 350px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .contact-wrapper {
    flex-direction: column;
  }
}
</style>
