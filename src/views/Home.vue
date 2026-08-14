<template>
  <div class="home">
    <img :src="bannerSrc" alt="Banner de inicio" class="full-width" />

    <Amplification />
    <Christmas v-if="christmasEvent" :data="christmasEvent" />
    <SpecialOffers v-if="specialOffersEvent" :data="specialOffersEvent" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

/* Components */
import Christmas from "../components/Div/Christmas.vue";
import SpecialOffers from "../components/Div/SpecialOffers.vue";
import Amplification from "../components/Div/Amplification.vue";

/* Services */
import {
  getChristmasEvent,
  getSpecialOffersEvent
} from "../services/events.js";
import { useConfig } from "../composables/useConfig.js";

const { load: loadConfig, banner } = useConfig();
const christmasEvent = ref(null);
const specialOffersEvent = ref(null);

const bannerSrc = computed(
  () => banner.value || "/imgs/banners/home-banner.svg"
);

onMounted(async () => {
  const [christmas, offers] = await Promise.all([
    getChristmasEvent(),
    getSpecialOffersEvent(),
    loadConfig()
  ]);

  christmasEvent.value = christmas[0] || null;
  specialOffersEvent.value = offers[0] || null;
});
</script>

<style scoped>
.full-width {
    width: calc(100% + 2rem);
    margin-left: -1rem;
    display: block;
}
</style>
