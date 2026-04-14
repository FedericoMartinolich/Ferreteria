<template>
  <div class="full-width">
    <section class="banner-new-products">
      <h2>{{ newProducts.title }}</h2>

      <div class="carousel-container">
        <button class="carousel-btn prev" @click="prevSlide">❮</button>

        <div class="carousel-wrapper">
          <div
            class="carousel-track"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div
              class="carousel-slide"
              v-for="(slide, index) in slides"
              :key="index"
            >
              <div class="products-grid">
                
                <!-- 🔥 NUEVA CARD -->
                <div
                  v-for="product in slide"
                  :key="product.id"
                  class="product-card"
                >
                  <div class="image-container">
                    <img
                      v-if="product.image_key"
                      :src="getProductImage(product)"
                      :alt="product.product"
                      loading="lazy"
                    />
                    <img v-else :src="emptyImg" alt="" />
                  </div>

                  <div class="card-content">
                    <h3 class="title">{{ product.product }}</h3>
                    <p class="price">${{ product.price }}</p>

                    <router-link
                      :to="`/ProductDetail/${product.id}`"
                      class="btn-add"
                    >
                      Ver producto
                    </router-link>
                  </div>
                </div>
                <!-- 🔥 FIN CARD -->

              </div>
            </div>
          </div>
        </div>

        <button class="carousel-btn next" @click="nextSlide">❯</button>
      </div>

      <div class="carousel-dots">
        <span
          v-for="(_, index) in slides"
          :key="index"
          :class="{ active: currentSlide === index }"
          @click="currentSlide = index"
        ></span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getProductById, getProductImage } from "../../services/products";
import emptyImg from "../../assets/imgs/emptys/emptyImg.png";

const props = defineProps({
  data: Object,
});

const newProducts = props.data;
const productData = ref([]);
const currentSlide = ref(0);
const itemsPerSlide = ref(4);

/* responsive */
const updateItemsPerSlide = () => {
  if (window.innerWidth < 640) itemsPerSlide.value = 1;
  else if (window.innerWidth < 1175) itemsPerSlide.value = 2;
  else if (window.innerWidth < 1460) itemsPerSlide.value = 3;
  else itemsPerSlide.value = 4; 
};

onMounted(async () => {
  updateItemsPerSlide();
  window.addEventListener("resize", updateItemsPerSlide);

  for (const id of newProducts.product_ids) {
    const product = await getProductById(id);
    if (product) productData.value.push(product);
  }
});

/* agrupar productos en slides */
const slides = computed(() => {
  const chunks = [];
  for (let i = 0; i < productData.value.length; i += itemsPerSlide.value) {
    chunks.push(productData.value.slice(i, i + itemsPerSlide.value));
  }
  return chunks;
});

const nextSlide = () => {
  currentSlide.value =
    (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};
</script>

<style scoped>
/* =========================
   BANNER
========================= */
.banner-new-products {
  padding: 2.5rem 0;
  background: linear-gradient(rgba(87, 51, 4, 0.7), rgba(187, 106, 13, 0.7));
}

.banner-new-products h2 {
  color: #f5f5f5;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  text-transform: uppercase;
}

/* =========================
   CARRUSEL
========================= */
.carousel-container {
  display: flex;
  align-items: center;
}

.carousel-wrapper {
  overflow: hidden;
  flex: 1;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  min-width: 100%;
}

/* =========================
   GRID (FIX IMPORTANTE)
========================= */
.products-grid {
  display: grid;
  gap: 1.5rem;
  padding: 1rem 3rem;

  grid-template-columns: repeat(auto-fit, minmax(260px, max-content));
  justify-content: center; /* 🔥 centra cuando hay pocas cards */
}

/* =========================
   CARD
========================= */
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: all 0.25s ease;

  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 320px; /* 🔥 evita que se agrande sola */
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

/* =========================
   IMAGEN (FIX REAL)
========================= */
.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f3f3;
  padding: 10px;
}

.image-container img {
  width: 100%;
  height: auto; /* 🔥 mantiene proporción */
  max-height: 250px; /* 🔥 limita sin deformar */
  object-fit: contain; /* 🔥 nunca recorta */
}

/* =========================
   CONTENIDO
========================= */
.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #000;
}

/* =========================
   BOTÓN
========================= */
.btn-add {
  margin-top: auto;
  text-align: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #c46a2b, #a85722);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.btn-add:hover {
  background: #b16634;
}

/* =========================
   BOTONES CARRUSEL
========================= */
.carousel-btn {
  background: #fff;
  border: 1px solid #ccc;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  color: #333;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.prev {
  margin-left: 80px;
}

.next {
  margin-right: 80px;
}

/* =========================
   DOTS
========================= */
.carousel-dots {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 8px;
}

.carousel-dots span {
  width: 10px;
  height: 10px;
  background: #ccc;
  border-radius: 50%;
  cursor: pointer;
}

.carousel-dots span.active {
  background: #000;
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 1024px) {
  .products-grid {
    padding: 1rem 2rem;
  }

  .prev {
    margin-left: 20px;
  }

  .next {
    margin-right: 20px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    padding: 1rem;
  }

  .prev,
  .next {
    margin: 0;
  }
}

/* =========================
   BONUS: 1 SOLA CARD
========================= */
.products-grid:has(.product-card:only-child) {
  justify-content: center;
}

.product-card:only-child {
  max-width: 400px;
}
</style>