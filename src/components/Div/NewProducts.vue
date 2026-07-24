<template>
  <section class="new-products-section">
    <h2 class="section-title">{{ newProducts.title }}</h2>

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
.new-products-section {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, #3b2a1d 0%, #5a3d2a 60%, #7a5540 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  overflow: hidden;
}

.section-title {
  text-align: center;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.03em;
}

/* =========================
   CARRUSEL
   ========================= */
.carousel-container {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.carousel-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 10px;
  background: #fff;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  min-width: 100%;
}

/* =========================
   GRID
   ========================= */
.products-grid {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-content: center;
}

/* =========================
   CARD
   ========================= */
.product-card {
  background: #fafafa;
  border: 1px solid #eee;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 280px;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #c46a2b;
}

/* =========================
   IMAGEN
   ========================= */
.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 12px;
}

.image-container img {
  width: 100%;
  height: auto;
  max-height: 180px;
  object-fit: contain;
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
  font-size: 0.9rem;
  font-weight: 600;
  color: #3b2a1d;
  margin: 0 0 6px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: #2f6b3c;
}

/* =========================
   BOTÓN
   ========================= */
.btn-add {
  margin-top: auto;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  background: linear-gradient(135deg, #c46a2b, #a85722);
  color: #fff;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 6px rgba(196, 106, 43, 0.25);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(196, 106, 43, 0.35);
}

/* =========================
   BOTONES CARRUSEL
   ========================= */
.carousel-btn {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #3b2a1d;
  transition: background 0.2s ease, transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.carousel-btn:hover {
  background: #fff;
  transform: scale(1.1);
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
  background: rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.carousel-dots span.active {
  background: #fff;
  transform: scale(1.2);
}

/* =========================
   RESPONSIVE
   ========================= */
@media (max-width: 768px) {
  .new-products-section {
    padding: 1.5rem 1rem;
  }

  .section-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .products-grid {
    padding: 1rem;
    gap: 0.8rem;
  }

  .carousel-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* =========================
   1 SOLA CARD
   ========================= */
.products-grid:has(.product-card:only-child) {
  grid-template-columns: 1fr;
  justify-items: center;
}

.product-card:only-child {
  max-width: 300px;
  width: 300px;
}
</style>
