<template>
  <div class="card">
    
    <!-- BADGE opcional -->
    <div v-if="product.badge" class="badge">{{ product.badge }}</div>

    <!-- IMAGEN -->
    <div class="tilt">
      <img
        v-if="product.image_key"
        :src="getProductImage(product)"
        :alt="product.product"
        loading="lazy"
        class="product-image"
        />

      <img v-else :src=emptyImg alt="">
    </div>

    <!-- INFO -->
    <div class="info">
      
      <!-- CATEGORIA -->
      <div class="cat">{{ product.category || 'Producto' }}</div>

      <!-- TITULO -->
      <h2 class="title">
        {{ product.product }}
      </h2>

      <!-- DESCRIPCION -->
      <p class="desc" v-if="product.description">
        {{ product.description }}
      </p>

      <!-- FEATURES -->
      <div class="feats" v-if="product.features?.length">
        <span class="feat" v-for="(f, i) in product.features" :key="i">
          {{ f }}
        </span>
      </div>

      <!-- PRECIO + BOTON -->
      <div class="bottom">
        <div class="price">
          <span v-if="product.old_price" class="old">${{ product.old_price }}</span>
          <span class="new">${{ product.price }}</span>
        </div>

        <button class="btn" @click="$emit('add')">
          <i class="fas fa-cart-plus"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { getProductImage } from '../services/products.js';
import emptyImg from "../assets/imgs/emptys/emptyImg.png"

const props = defineProps({
  product: Object
});
</script>

<style scoped>
/* TILT */
.tilt {
  height: 200px;
  overflow: hidden;
  background: var(--gray-50);
}

.tilt img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover .tilt img {
  transform: scale(1.06);
}

.card {
  width: 100%;
  background: var(--white);
  border: 1px solid var(--gray-200);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  position: relative;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* BADGE */
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--orange);
  color: var(--white);
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 999px;
  font-weight: 600;
  z-index: 2;
}

/* INFO */
.info {
  padding: 14px;
}

.cat {
  font-size: 10px;
  text-transform: uppercase;
  color: var(--gray-400);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--navy);
  margin: 0 0 6px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.desc {
  font-size: 12px;
  color: var(--gray-600);
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* FEATURES */
.feats {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}
.feat {
  font-size: 9px;
  background: var(--gray-100);
  color: var(--gray-600);
  padding: 3px 7px;
  border-radius: 4px;
}

/* BOTTOM */
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--gray-200);
  gap: 8px;
  min-width: 0;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price .old {
  text-decoration: line-through;
  font-size: 11px;
  color: #bbb;
}

.price .new {
  font-size: 1.1rem;
  font-weight: 700;
  color: #b91c1c;
}

/* BUTTON */
.btn {
  background: var(--navy);
  color: var(--white);
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 6px rgba(13, 27, 42, 0.2);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(13, 27, 42, 0.3);
  background: var(--orange);
}

@media (max-width: 480px) {
  .info {
    padding: 10px;
  }

  .title {
    font-size: 0.85rem;
  }

  .price .new {
    font-size: 0.95rem;
  }

  .btn {
    width: 30px;
    height: 30px;
    font-size: 12px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .bottom {
    padding-top: 8px;
  }
}
</style>
