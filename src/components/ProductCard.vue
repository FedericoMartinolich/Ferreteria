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
        <i class="fas fa-hammer"></i>
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
          <span>Agregar</span>
          <i class="fas fa-cart-plus"></i>
        </button>
      </div>

      <!-- META -->
      <div class="meta">
        <!-- <div class="rating">
          ⭐⭐⭐⭐⭐
          <span class="rcount">({{ reviews || 0 }})</span>
        </div> -->

        <!-- <div class="stock">
          {{ stock ? 'En stock' : 'Sin stock' }}
        </div> -->
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
  background: #f5f5f5;
}

.tilt img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover .tilt img {
  transform: scale(1.08);
}

.card {
  /* width: 100%; */
  max-width: 320px;
  background: linear-gradient(160deg, #ffffff, #f7f3ee);
  border-radius: 18px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  transition: 0.25s;
  overflow: hidden;
  position: relative;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

/* BADGE */
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #c46a2b, #a85722);
  color: #fff;
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 999px;
  font-weight: 600;
}

/* IMAGE */
.img {
  height: 180px;
  overflow: hidden;
}
.img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.4s;
}
.card:hover img {
  transform: scale(1.05);
}

/* INFO */
.info {
  padding: 16px;
}

.cat {
  font-size: 11px;
  text-transform: uppercase;
  color: #888;
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: #3b2a1d;
  margin: 6px 0;
}

.title i {
  color: #c46a2b;
  margin-right: 5px;
}

.desc {
  font-size: 13px;
  color: #555;
  margin-bottom: 10px;
}

/* FEATURES */
.feats {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}
.feat {
  font-size: 10px;
  background: #f1f1f1;
  padding: 3px 7px;
  border-radius: 10px;
}

/* BOTTOM */
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price .old {
  text-decoration: line-through;
  font-size: 12px;
  color: #aaa;
}
.price .new {
  font-size: 18px;
  font-weight: 700;
  color: #2f6b3c;
}

/* BUTTON */
.btn {
  background: linear-gradient(135deg, #c46a2b, #a85722);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn:hover {
  filter: brightness(1.05);
}

/* META */
.meta {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  border-top: 1px solid #eee;
  padding-top: 8px;
}

.stock {
  color: #2f6b3c;
  font-weight: 600;
}
</style>