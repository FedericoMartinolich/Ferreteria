<template>
  <main>
    <div class="contact-view">
    <section id="contact">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div id="container">	    
            <div class="product-details">       
                <div class="direct-contact-container">
                    <ul class="contact-list">
                        <li class="list-item">
                        <i class="fa fa-map-marker fa-2x"></i>
                        <span class="contact-text place">Gualeguaychú Entre Rios, Argentina</span>
                        </li>
                        <li class="list-item">
                        <i class="fa fa-brands fa-whatsapp fa-2x"></i>
                        <span class="contact-text phone"
                            ><a href="https://wa.me/543446670475" target="_blank">(54) 3446 67-0475</a></span
                        >
                        </li>
                        <li class="list-item">
                        <i class="fa fa-envelope fa-2x"></i>
                        <span class="contact-text gmail"
                            ><a href="mailto:martinolichfederico@gmail.com">alguncorreo@gmail.com</a></span
                        >
                        </li>
                    </ul>

                    <hr />

                    <ul class="social-media-list">
                        <li>
                        <a href="https://www.linkedin.com/in/federico-martinolich" target="_blank" class="contact-icon"
                            ><i class="fa fa-brands fa-linkedin-in"></i
                        ></a>
                        </li>
                        <li>
                        <a href="https://github.com/FedericoMartinolich" target="_blank" class="contact-icon"
                            ><i class="fa fa-brands fa-github"></i
                        ></a>
                        </li>
                        <li>
                        <a href="https://www.instagram.com/ferreteria.elmoro/" target="_blank" class="contact-icon"
                            ><i class="fa fa-brands fa-instagram"></i
                        ></a>
                        </li>
                    </ul>
                    <hr />
                    <div class="copyright">© All rights reserved</div>
                </div>    
            </div>
            
        <div class="product-image">        
            <div id="map" class="map"></div>
        </div>

        </div>
    </section>
    </div>
  </main>
</template>

<script setup>
import L from 'leaflet';
import { onMounted } from 'vue';

onMounted(() => {
var map = L.map('map', {
    attributionControl: false
}).setView([-33.001651, -58.518268], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([-33.001651, -58.518268]).addTo(map)
  .bindPopup('El Moro - Gualeguaychú, Entre Ríos')
  .openPopup();
});
</script>

<style scoped>

#container {
  box-shadow: 0 15px 30px 1px #0f0b05;
  background: #372613;
  text-align: center;
  border-radius: 5px;
  overflow: hidden;
  margin: 5em auto;
  height: 350px;
  width: 700px;
}

.product-details {
  position: relative;
  text-align: left;
  overflow: hidden;
  padding: 30px;
  height: 100%;
  float: left;
  width: 40%;
}

#container .product-details h1 {
  font-family: "Bebas Neue", cursive;
  display: inline-block;
  position: relative;
  font-size: 30px;
  color: #344055;
  margin: 0;
}

#container .product-details h1:before {
  position: absolute;
  content: "";
  right: 0%;
  top: 0%;
  transform: translate(25px, -15px);
  font-family: "Bree Serif", serif;
  display: inline-block;
  background: #ffe6e6;
  border-radius: 5px;
  font-size: 14px;
  padding: 5px;
  color: white;
  margin: 0;
  animation: chan-sh 6s ease infinite;
}

.hint-star {
  display: inline-block;
  margin-left: 0.5em;
  color: gold;
  width: 50%;
}

#container .product-details > p {
  font-family: "EB Garamond", serif;
  text-align: center;
  font-size: 18px;
  color: #7d7d7d;
}
.control {
  position: absolute;
  bottom: 20%;
  left: 22.8%;
}
.btn {
  transform: translateY(0px);
  transition: 0.3s linear;
  background: #809fff;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  outline: none;
  border: none;
  color: #eee;
  padding: 0;
  margin: 0;
}

.btn:hover {
  transform: translateY(-6px);
  background: #1a66ff;
}

.btn span {
  font-family: "Farsan", cursive;
  transition: transform 0.3s;
  display: inline-block;
  padding: 10px 20px;
  font-size: 1.2em;
  margin: 0;
}
.btn .price,
.shopping-cart {
  background: #333;
  border: 0;
  margin: 0;
}

.btn .price {
  transform: translateX(-10%);
  padding-right: 15px;
}

.btn .shopping-cart {
  transform: translateX(-100%);
  position: absolute;
  background: #333;
  z-index: 1;
  left: 0;
  top: 0;
}

.btn .buy {
  z-index: 3;
  font-weight: bolder;
}

.btn:hover .price {
  transform: translateX(-110%);
}

.btn:hover .shopping-cart {
  transform: translateX(0%);
}

.product-image {
  transition: all 0.3s ease-out;
  display: inline-block;
  position: relative;
  overflow: hidden;
  height: 100%;
  float: right;
  width: 45%;
  display: inline-block;
}

.map {
  width: 100%;
  height: 100%;
  z-index: 19;
}

.info {
  background: rgba(27, 26, 26, 0.9);
  font-family: "Bree Serif", serif;
  transition: all 0.3s ease-out;
  transform: translateX(-100%);
  position: absolute;
  line-height: 1.8;
  text-align: left;
  font-size: 105%;
  cursor: no-drop;
  color: #fff;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.info h2 {
  text-align: center;
}
.product-image:hover .info {
  transform: translateX(0);
}

.info ul li {
  transition: 0.3s ease;
}
.info ul li:hover {
  transform: translateX(50px) scale(1.3);
}

/* .map .product-image:hover {
  transition: all 0.3s ease-out;
}
.map .product-image:hover {
  transform: scale(1.2, 1.2);
} */

/* Contacto derecho */
.direct-contact-container {
  max-width: 400px;
  text-align: left;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  color: #aaa;
}

.list-item i {
  width: 30px;
  text-align: center;
  margin-right: 10px;
}

.contact-text a {
  color: #fff;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-text a:hover {
  color: #6b6729;
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
  background: #634522;
  border-radius: 50%;
  color: #fff;
  transition: all 0.3s;
}

.contact-icon:hover {
  background: #6b6729;
  transform: scale(1.1);
}

.copyright {
  text-align: center;
  color: #777;
  margin-top: 20px;
  font-size: 14px;
}
</style>