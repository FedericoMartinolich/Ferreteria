<template>
    <header class="app-header">
        <div class="container">
            <div class="brand" @click="goHome">
                <img v-if="logo" :src="logo" :alt="title" class="logo" />
                <!-- <span class="title">{{ title }}</span> -->
            </div>

            <button class="burger" @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen">
                <span class="bar" />
                <span class="bar" />
                <span class="bar" />
            </button>

            <nav :class="{ open: mobileOpen }" class="nav">
                <ul>
                    <li v-for="link in links">
                        <RouterLink
                            :to="link.href"
                        >
                            {{ link.label }}
                        </RouterLink>
                    </li>
                </ul>
            </nav>

            <div class="actions">
                <form @submit.prevent="submitSearch" class="search">
                    <input
                        v-model="query"
                        type="search"
                        :placeholder="searchPlaceholder"
                        aria-label="Buscar"
                    />
                    <button type="submit" title="Buscar"><i class="fa fa-solid fa-magnifying-glass"></i></button>
                </form>

                <button class="cart" @click="$emit('toggle-cart')">
                    <i class="fa fa-solid fa-cart-shopping"></i>
                    <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    title: { type: String, default: 'Ferretería' },
    logo: { type: String, default: '' },
    links: {
        type: Array,
        default: () => [
            { label: 'Inicio', href: '/' },
            { label: 'Productos', href: '/products' },
            { label: 'Contacto', href: '/contact' },
            { label: 'Nosotros', href: '/about' }
        ]
    },
    cartCount: { type: Number, default: 0 },
    searchPlaceholder: { type: String, default: 'Buscar producto...' }
})

const emit = defineEmits(['search', 'navigate', 'toggle-cart', 'home'])

const query = ref('')
const mobileOpen = ref(false)

function submitSearch() {
    const q = query.value.trim()
    emit('search', q)
}

function navigate(link) {
    mobileOpen.value = false
    emit('navigate', link)
}

function goHome() {
    emit('home')
    mobileOpen.value = false
}

// optional: clear query after external reset (consumer can set a prop to clear; here we watch cartCount as an example)
watch(() => props.cartCount, () => {
    // no-op, placeholder for watchers if needed
})
</script>

<style scoped>
.app-header {
    background: #f08521;
    border-bottom: 1px solid #372613;
    position: sticky;
    top: 0;
    z-index: 20;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.logo {
    height: 100px;
    width: auto;
}

.title {
    font-weight: 600;
    font-size: 1.05rem;
}

.burger {
    display: none;
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
}

.burger .bar {
    display: block;
    width: 20px;
    height: 2px;
    background: #333;
    margin: 3px 0;
}

.nav {
    margin-left: auto;
}

.nav ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav a {
    color: #333;
    text-decoration: none;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
}

.nav a:hover {
    background: #d17219;
    transition: background 200ms;
    color: #fff;
}

.actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-left: 1rem;
}

.search {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.search input {
    border: 1px solid #372613;
    padding: 6px 8px;
    border-radius: 4px;
}

.search button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.cart {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
}

.badge {
    position: absolute;
    top: -6px;
    right: -8px;
    background: #e53e3e;
    color: #fff;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 999px;
}

.fa {
    font-size: 1.1rem;
    color: #333;
}

/* Responsive */
@media (max-width: 768px) {
    .burger {
        display: inline-flex;
        margin-left: 0.25rem;
    }

    .nav {
        position: absolute;
        left: 0;
        right: 0;
        top: 60px;
        background: #f08521;
        border-top: 1px solid #372613;
        display: none;
        padding: 0.75rem 1rem;
    }

    .nav.open {
        display: block;
    }

    .nav ul {
        flex-direction: column;
        gap: 0.5rem;
    }

    .container {
        align-items: center;
    }

    .actions {
        margin-left: 0;
    }
}
</style>