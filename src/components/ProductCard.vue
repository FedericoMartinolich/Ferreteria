<template>
    <div class="product-card">
        <div class="product-header">
            <h3 class="product-name">{{ product }}</h3>
            <span class="product-price">${{ price }}</span>
        </div>
        <div class="product-footer">
            <button class="btn-primary">Agregar al carrito</button>
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
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    transition: transform 0.2s;
}

.product-card:hover {
    transform: scale(1.02);
}

.product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.product-name {
    flex: 1;
    margin: 0;
    font-weight: 600;
    color: #333;
}

.product-price {
    font-weight: 700;
    color: #2ecc71;
    font-size: 20px;
    white-space: nowrap;
}

.product-footer {
    display: flex;
    gap: 8px;
}

.btn-primary {
    flex: 1;
    padding: 10px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;
}

.btn-primary:hover {
    background-color: #2980b9;
}

/* Responsive styles */
@media (max-width: 1200px) {
    .product-header {
        font-size: small;
    }

    .product-price {
        margin-left: 10px;
    }
}

@media (max-width: 900px) {
    .product-card {
        padding: 12px;
    }

    .product-price {
        font-size: 18px;
    }

    .btn-primary {
        padding: 8px 12px;
    }
}
</style>