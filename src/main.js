import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "leaflet/dist/leaflet.css";


createApp(App)
    .use(router)
    .mount('#app')
