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
                  <img v-if="product.image" :src="product.image" />
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
import { getProductById } from "../../services/products";

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
  else if (window.innerWidth < 1024) itemsPerSlide.value = 2;
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
.banner-new-products {
  padding: 2rem 0;
  background: linear-gradient(135deg, #1139ee 0%, #3817c9 100%);
}

.banner-new-products h2 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

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

.products-grid {
  display: grid;
  gap: 1.5rem;
  padding: 1rem 3rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.product-card h3 {
  padding: 1rem;
  color: #667eea;
}

.price {
  padding: 0 1rem;
  font-weight: bold;
}

.btn-add {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0%;
}

.carousel-btn {
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  line-height: 1;
  color: #1139ee;
}

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
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.carousel-dots span.active {
  background: white;
}

.prev {
    margin-left: 120px;
}
.next {
    margin-right: 120px;
}

</style>
