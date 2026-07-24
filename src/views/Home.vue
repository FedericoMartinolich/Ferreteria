<template>
  <div class="home">
    <div class="banner-wrapper">
      <img src="../../public/imgs/banners/home-banner.jpg" alt="Home Banner" class="banner" />
    </div>
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
.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 2rem;
}

.banner-wrapper {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  overflow: hidden;
  border-radius: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.banner {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

@media (max-width: 768px) {
  .home {
    gap: 1.2rem;
  }

  .banner-wrapper {
    border-radius: 0;
  }
}
</style>
