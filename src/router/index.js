import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
    { path: '/about', name: 'About', component: () => import('../views/About.vue') },
    { path: '/contact', name: 'Contact', component: () => import('../views/Contact.vue') },
    { path: '/products', name: 'Products', component: () => import('../views/Products.vue') },
    { path: '/cart', name: 'Cart', component: () => import('../views/Cart.vue') },
    { path: '/ProductDetail/:id', name: 'ProductDetail', props: true, component: () => import('../views/ProductDetail.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' } // fallback
]

const router = createRouter({
    history: createWebHashHistory(/* import.meta.env.BASE_URL */),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router