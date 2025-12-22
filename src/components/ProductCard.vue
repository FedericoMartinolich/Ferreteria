<template>
  <div class="product-card">
    <div class="product-header">
      <h3 class="product-name">
        <i class="fas fa-hammer"></i>
        {{ product }}
      </h3>
      <span class="product-price">${{ price }}</span>
    </div>

    <div class="product-footer">
      <button class="btn-primary">
        <i class="fas fa-cart-plus"></i>
        Agregar
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
    product: { type: String },
    price: { type: String },
});
</script>

<style scoped>
.product-card {
  background: linear-gradient(145deg, #ffffff, #f4efe8);
  border: 1px solid rgba(74, 55, 40, 0.25);
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.35);
}

/* ===============================
   HEADER
   =============================== */

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 1.2rem;
}

.product-name {
  flex: 1;
  margin: 0;
  font-weight: 700;
  font-size: 1rem;
  color: #4a3728;
  line-height: 1.25;
}

.product-name i {
  color: #c46a2b;
  margin-right: 6px;
}

/* ===============================
   PRECIO
   =============================== */

.product-price {
  font-weight: 800;
  font-size: 1.25rem;
  color: #2f6b3c; /* verde ferretería */
  white-space: nowrap;
}

/* ===============================
   FOOTER
   =============================== */

.product-footer {
  margin-top: auto;
}

/* ===============================
   BOTÓN
   =============================== */

.btn-primary {
  width: 100%;
  padding: 10px 14px;
  background: linear-gradient(145deg, #c46a2b, #a85722);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: filter 0.25s ease, transform 0.2s ease;
}

.btn-primary:hover {
  filter: brightness(1.1);
  transform: scale(1.03);
}

.btn-primary i {
  font-size: 0.95rem;
}

/* ===============================
   RESPONSIVE
   =============================== */

@media (max-width: 900px) {
  .product-name {
    font-size: 0.95rem;
  }

  .product-price {
    font-size: 1.15rem;
  }
}

@media (max-width: 600px) {
  .product-card {
    padding: 1rem;
  }

  .btn-primary {
    padding: 8px 12px;
  }
}

</style>