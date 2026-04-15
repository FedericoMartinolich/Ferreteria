<template>
  <div>
    <img src="../../public/imgs/banners/home-banner.jpg" alt="Home Banner" class="full-width" />
    <Amplification />
    <Christmas v-if="christmasEvent" :data="christmasEvent" />
    <SpecialOffers v-if="specialOffersEvent" :data="specialOffersEvent" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

/* Components */
import Christmas from "../components/Div/Christmas.vue";
import SpecialOffers from "../components/Div/SpecialOffers.vue";
import Amplification from "../components/Div/Amplification.vue";

/* Services */
import {
  getChristmasEvent,
  getSpecialOffersEvent
} from "../services/events.js";

const christmasEvent = ref(null);
const specialOffersEvent = ref(null);

onMounted(async () => {
  const [christmas, offers] = await Promise.all([
    getChristmasEvent(),
    getSpecialOffersEvent()
  ]);

  christmasEvent.value = christmas[0] || null;
  specialOffersEvent.value = offers[0] || null;
});
</script>
<style scoped>
.full-width {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
}
</style>
