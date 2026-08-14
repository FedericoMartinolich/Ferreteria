<template>
  <section class="new-products-section">
    <template v-if="loading">
      <h2 class="section-title">&nbsp;</h2>
      <div class="carousel-container">
        <button class="carousel-btn prev" disabled>❮</button>
        <div class="carousel-wrapper">
          <div class="products-grid">
            <div v-for="n in 4" :key="n" class="skeleton-card">
              <div class="skeleton-img"></div>
              <div class="skeleton-text skeleton-text-title"></div>
              <div class="skeleton-text skeleton-text-price"></div>
              <div class="skeleton-text skeleton-text-btn"></div>
            </div>
          </div>
        </div>
        <button class="carousel-btn next" disabled>❯</button>
      </div>
    </template>

    <template v-else>
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
    </template>
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
const loading = ref(true);

/* responsive */
const updateItemsPerSlide = () => {
  if (window.innerWidth < 640) itemsPerSlide.value = 2;
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
  loading.value = false;
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
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
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
  background: var(--navy);
  box-shadow: var(--shadow-sm);
  box-sizing: border-box;
  overflow: hidden;
}

.section-title {
  text-align: center;
  color: var(--white);
  font-size: 1.6rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 1.5rem 0;
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
  border-radius: var(--radius-xl);
  background: var(--white);
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
  justify-items: center;
}

/* =========================
   CARD
   ========================= */
.product-card {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 280px;
  box-sizing: border-box;
  border-radius: var(--radius-xl);
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

/* =========================
   IMAGEN
   ========================= */
.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--white);
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
  color: var(--navy);
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
  color: var(--price);
}

/* =========================
   BOTÓN
   ========================= */
.btn-add {
  margin-top: auto;
  text-align: center;
  padding: 8px;
  border-radius: var(--radius-md);
  background: var(--orange);
  color: var(--white);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: var(--shadow-orange-xs);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-orange-md);
  background: var(--orange-hover);
}

/* =========================
   BOTONES CARRUSEL
   ========================= */
.carousel-btn {
  flex-shrink: 0;
  background: var(--white);
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--navy);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  box-shadow: var(--shadow-xs);
}

.carousel-btn:hover {
  background: var(--gray-100);
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
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.carousel-dots span.active {
  background: var(--white);
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
    gap: 0.6rem;
  }

  .carousel-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }

  .image-container {
    padding: 8px;
  }

  .card-content {
    padding: 0.6rem;
  }

  .title {
    font-size: 0.75rem;
  }

  .price {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }

  .btn-add {
    padding: 5px;
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    padding: 0.6rem;
  }

  .products-grid:has(.product-card:only-child) {
    grid-template-columns: 1fr;
  }

  .image-container {
    padding: 6px;
    max-height: 100px;
  }

  .image-container img {
    max-height: 90px;
  }

  .card-content {
    padding: 0.5rem;
  }

  .title {
    font-size: 0.65rem;
    margin-bottom: 3px;
  }

  .price {
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
  }

  .btn-add {
    padding: 4px;
    font-size: 0.65rem;
  }

  .carousel-btn {
    width: 26px;
    height: 26px;
    font-size: 12px;
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

/* =========================
   SKELETON LOADING
   ========================= */
.skeleton-card {
  background: var(--gray-100);
  border-radius: var(--radius-xl);
  padding: 0;
  overflow: hidden;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-text {
  margin: 12px 14px 0;
  border-radius: var(--radius-md);
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-text-title {
  width: 70%;
  height: 16px;
}

.skeleton-text-price {
  width: 40%;
  height: 18px;
}

.skeleton-text-btn {
  width: 55%;
  height: 14px;
  margin-bottom: 14px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
