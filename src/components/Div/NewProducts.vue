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
                <div
                  v-for="product in slide"
                  :key="product.id"
                  class="product-card"
                >
                  <img
                    v-if="product.image_key"
                    :src="getProductImage(product)"
                    :alt="product.product"
                    loading="lazy"
                    class="product-image"
                    />

                  <img v-else :src=emptyImg alt="">
                  <h3>{{ product.product }}</h3>
                  <p class="price">${{ product.price }}</p>
                    <button class="btn-add">
                        <router-link :to="`/ProductDetail/${product.id}`" class="btn-add">
                         Agregar al carrito
                        </router-link>
                    </button>
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
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { getProductById, getProductImage } from "../../services/products";
import emptyImg from "../../assets/imgs/emptys/emptyImg.png"

const props = defineProps({
  data: Object,
});

const newProducts = props.data;
const productData = ref([]);
const currentSlide = ref(0);
const itemsPerSlide = ref(3);

/* responsive */
const updateItemsPerSlide = () => {
  if (window.innerWidth < 640) itemsPerSlide.value = 1;
  else if (window.innerWidth < 1024) itemsPerSlide.value = 2;
  else itemsPerSlide.value = 3;
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
   BANNER NUEVOS PRODUCTOS
========================= */
.banner-new-products {
  padding: 2.5rem 0;
  background:
    linear-gradient(rgba(59, 34, 2, 0.712), rgba(95, 57, 14, 0.733));
  background-size: cover;
  background-position: center;
}

/* =========================
   TITULO
========================= */
.banner-new-products h2 {
  color: #f5f5f5;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

/* =========================
   CARRUSEL
========================= */
.carousel-container {
  display: flex;
  align-items: center;
  position: relative;
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
   GRID PRODUCTOS
========================= */
.products-grid {
  display: grid;
  gap: 1.5rem;
  padding: 1rem 3rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

/* =========================
   TARJETA PRODUCTO
========================= */
.product-card {
  background: #f8f5f2;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #d6c2ad;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
}

img {
  max-width: 20rem;
}

.product-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-bottom: 3px solid #a47148;
}

/* =========================
   TEXTO PRODUCTO
========================= */
.product-card h3 {
  padding: 0.75rem 1rem;
  color: #5a3e2b;
  font-weight: 600;
  font-size: 18px;
}

.price {
  padding: 0 1rem 0.5rem;
  font-weight: bold;
  color: #2f2f2f;
}

/* =========================
   BOTON AGREGAR
========================= */
.btn-add {
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #d18b2c, #b8741f);
  color: white;
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  border-radius: 0%;
}

.btn-add:hover {
  background: linear-gradient(135deg, #e19a3a, #c07b25);
  transform: scale(1.03);
}

/* =========================
   BOTONES CARRUSEL
========================= */
.carousel-btn {
  background: linear-gradient(145deg, #f0f0f0, #bdbdbd);
  border: 1px solid #6b6b6b;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #2f2f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.carousel-btn:hover {
  background: linear-gradient(145deg, #ffffff, #cfcfcf);
}

.prev {
  margin-left: 120px;
}

.next {
  margin-right: 120px;
}

/* =========================
   DOTS
========================= */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;
}

.carousel-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
}

.carousel-dots span.active {
  background: #d18b2c;
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 1024px) {
  .products-grid {
    padding: 1rem 2rem;
    gap: 1.25rem;
  }

  .prev {
    margin-left: 40px;
  }

  .next {
    margin-right: 40px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    padding: 1rem;
    grid-template-columns: 1fr;
  }

  .product-card img {
    height: 200px;
  }

  .carousel-btn {
    width: 34px;
    height: 34px;
    font-size: 18px;
  }

  .prev,
  .next {
    margin: 0;
  }
}

@media (max-width: 420px) {
  .banner-new-products h2 {
    font-size: 22px;
  }

  .product-card img {
    height: 170px;
  }

  .product-card h3 {
    font-size: 16px;
  }

  .price {
    font-size: 15px;
  }
}
</style>

