<template>
  <div class="christmas-section">
    <h1 class="section-title">{{ christmas.title }}</h1>
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
            <div v-for="product in slide" :key="product.id" class="product-item">
              <div class="product-image-wrapper">
                <img
                  v-if="product.image_key"
                  :src="getProductImage(product)"
                  :alt="product.product"
                  loading="lazy"
                  class="product-image"
                />
                <img v-else :src="emptyImg" alt="" class="product-image" />
                <span v-if="product.discount !== 0" class="discount-badge">
                  -{{ Number(product.discount).toFixed(0) }}%
                </span>
              </div>

              <div class="offer-content">
                <h2>{{ product.product }}</h2>
                <p>{{ product.description }}</p>

                <div class="price-section">
                  <span v-if="product.originalPrice" class="original-price">
                    ${{ product.originalPrice }}
                  </span>
                  <span class="discount-price">${{ product.price }}</span>
                </div>

                <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }" class="product-link">
                  <button class="btn-buy">Agregar al carrito</button>
                </router-link>
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
        :class="{ active: index === currentIndex }"
        @click="currentIndex = index"
      ></span>
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

const christmas = props.data;
const productData = ref([]);
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

  for (const id of christmas.product_ids) {
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

const currentIndex = ref(0);

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};
</script>

<style scoped>
.christmas-section {
  width: 100%;
  max-width: 1100px;
  margin: 2.5rem auto;
  padding: 2.5rem 1.5rem;
  background: linear-gradient(135deg, #0a3318 0%, #0e7733 60%, #1a9944 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

.section-title {
  text-align: center;
  color: var(--white);
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.02em;
}

.carousel-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.carousel-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
  background: var(--white);
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.carousel-slide {
  width: 100%;
  animation: fadeIn 0.4s ease;
}

.offer-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  overflow: hidden;
}

.product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex: 1 1 auto;
  min-width: 0;
  max-width: 320px;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 14px;
  padding: 1.2rem 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 180px;
  height: 180px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--white);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-item:hover .product-image {
  transform: scale(1.06);
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: var(--white);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.offer-content {
  text-align: center;
  flex: 1;
  min-width: 180px;
}

.offer-content h2 {
  margin: 0 0 0.4rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--navy);
  line-height: 1.3;
}

.offer-content p {
  margin: 0 0 0.8rem 0;
  font-size: 0.8rem;
  color: var(--gray-600);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-section {
  margin-bottom: 0.8rem;
}

.original-price {
  text-decoration: line-through;
  color: #bbb;
  margin-right: 6px;
  font-size: 0.85rem;
}

.discount-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #b91c1c;
}

.btn-buy {
  background: #0a3318;
  color: var(--white);
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-buy:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(10, 51, 24, 0.3);
}

.carousel-btn {
  flex-shrink: 0;
  background: var(--white);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  color: #0a3318;
  transition: background 0.2s ease, transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.carousel-btn:hover {
  background: var(--gray-100);
  transform: scale(1.1);
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1.2rem;
}

.carousel-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.carousel-dots span.active {
  background: var(--white);
  transform: scale(1.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Tablet */
@media (max-width: 1024px) {
  .offer-card {
    padding: 1.2rem;
    gap: 1.2rem;
  }

  .product-image-wrapper {
    max-width: 150px;
    height: 150px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .christmas-section {
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }

  .section-title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .carousel-container {
    gap: 8px;
  }

  .carousel-wrapper {
    min-height: auto;
    border-radius: 8px;
  }

  .offer-card {
    flex-direction: row;
    padding: 1rem;
    gap: 1rem;
    align-items: stretch;
  }

  .product-item {
    flex: 0 0 100%;
    max-width: 100%;
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
  }

  .product-image-wrapper {
    max-width: 100px;
    min-width: 100px;
    height: 100px;
  }

  .offer-content {
    text-align: left;
  }

  .btn-buy {
    width: 100%;
    padding: 10px;
  }

  .carousel-btn {
    width: 34px;
    height: 34px;
    font-size: 16px;
  }

  .carousel-dots {
    margin-top: 0.8rem;
  }
}

@media (max-width: 420px) {
  .product-image-wrapper {
    max-width: 80px;
    min-width: 80px;
    height: 80px;
  }

  .discount-price {
    font-size: 1.2rem;
  }

  .product-item {
    padding: 0.8rem;
  }
}
</style>
