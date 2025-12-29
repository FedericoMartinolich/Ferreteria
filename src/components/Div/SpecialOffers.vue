<template>
  <div class="full-width">
    <div class="special-offers">
      <h1>{{ data.title }}</h1>

      <div class="carousel-container">
        <button class="carousel-btn prev" @click="prevSlide">❮</button>

        <div class="carousel-wrapper">
          <div
            class="carousel-slide"
            v-for="(slide, index) in slides"
            :key="index"
            v-show="currentIndex === index"
          >
            <div class="offer-card">
              <div
                v-for="product in slide"
                :key="product.id"
                class="product-item"
              >
                <img
                    v-if="product.image_key"
                    :src="getProductImage(product)"
                    :alt="product.product"
                    loading="lazy"
                    class="product-image"
                    />

                <img v-else :src=emptyImg alt="">

                <div class="offer-content">
                  <h2>{{ product.product }}</h2>
                  <p v-if="product.description">{{ product.description }}</p>

                  <div class="price-section">
                    <span v-if="product.originalPrice" class="original-price">
                      ${{ product.originalPrice }}
                    </span>
                    <span class="discount-price">
                      ${{ product.price }}
                    </span>
                  </div>

                  <span class="discount-badge">
                    -{{ Number(product.discount).toFixed(0) }}%
                  </span>
                </div>

                <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }" class="product-link">
                  <button class="btn-buy">Agregar al carrito</button>
                </router-link>
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
          :class="{ active: currentIndex === index }"
          @click="currentIndex = index"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getProductById, getProductImage } from "../../services/products";
import emptyImg from "../../assets/imgs/emptys/emptyImg.png"

const props = defineProps({
  data: Object,
});

const productData = ref([]);
const currentIndex = ref(0);
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

  for (const id of props.data.product_ids) {
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
  currentIndex.value =
    (currentIndex.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + slides.value.length) %
    slides.value.length;
};
</script>


<style scoped>
.btn-buy {
  background: #c41e3a;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

img {
  max-width: 14rem;
}

.special-offers {
    width: 100%;
    padding-top: 2rem;
    padding-bottom: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.carousel-container {
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
}

.carousel-wrapper {
    flex: 1;
    overflow: hidden;
    border-radius: 8px;
    background: white;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-slide {
    width: 100%;
    animation: fadeIn 0.5s;
}

.offer-content {
    text-align: center;
    padding: 40px 20px;
}

.offer-content h2 {
    margin: 0 0 10px 0;
    font-size: 28px;
    color: #333;
}

.offer-content p {
    margin: 0 0 20px 0;
    color: #666;
}

.discount {
    display: inline-block;
    background: #ff6b6b;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 20px;
    font-weight: bold;
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
    color: #667eea;
}

.carousel-btn:hover {
    background: #f0f0f0;
}

.carousel-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
}

.carousel-dots span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: background 0.3s;
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

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.offer-card {
  display: flex;
  gap: 30px;
  padding: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 280px;
}

.offer-image {
  width: 260px;
  height: 260px;
  object-fit: cover;
  border-radius: 8px;
}

.discount-badge {
  background: #ff6b6b;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
}

@media (max-width: 1024px) {
  .offer-card {
    padding: 30px;
    gap: 20px;
  }

  .product-item {
    max-width: 220px;
  }

  .offer-image {
    width: 220px;
    height: 220px;
  }

  .offer-content h2 {
    font-size: 22px;
  }

  .prev {
    margin-left: 40px;
  }

  .next {
    margin-right: 40px;
  }

  .price-section {
    margin-bottom: 15px;
  }

  .original-price {
    text-decoration: line-through;
    color: #999;
    margin-right: 10px;
  }

  .discount-price {
    font-size: 26px;
    font-weight: bold;
    color: #c41e3a;
  }
}

@media (max-width: 768px) {
  .special-offers h1 {
    font-size: 26px;
    text-align: center;
    margin-bottom: 20px;
  }

  .btn-buy {
    width: 100%;
    padding: 12px;
    margin-top: 15px;
  }

  .carousel-container {
    gap: 10px;
  }

  .carousel-wrapper {
    min-height: auto;
    padding: 10px 0;
  }

  .offer-card {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }

  .product-item {
    max-width: 100%;
  }

  .offer-image {
    width: 200px;
    height: 200px;
  }

  .offer-content {
    text-align: center;
    padding: 0;
    position: relative;
  }

  .offer-content h2 {
    font-size: 20px;
  }

  .offer-content p {
    font-size: 14px;
  }

  .price-section {
    margin-bottom: 15px;
  }

  .discount-badge {
    top: -10px;
    right: 50%;
    transform: translateX(50%);
  }

  .original-price {
    text-decoration: line-through;
    color: #999;
    margin-right: 10px;
  }

  .discount-price {
    font-size: 26px;
    font-weight: bold;
    color: #c41e3a;
  }

  /* Flechas */
  .carousel-btn {
    width: 34px;
    height: 34px;
    font-size: 18px;
  }

  .prev,
  .next {
    margin: 0;
  }

  /* Dots */
  .carousel-dots {
    margin-top: 10px;
  }
}

@media (max-width: 420px) {
  .offer-image {
    width: 170px;
    height: 170px;
  }

  .offer-content h2 {
    font-size: 18px;
  }
}

</style>