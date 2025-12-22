<template>
  <div>
    <Christmas v-if="christmasEvent" :data="christmasEvent" />
    <SpecialOffers v-if="specialOffersEvent" :data="specialOffersEvent" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

/* Components */
import Christmas from "../components/Div/Christmas.vue";
import SpecialOffers from "../components/Div/SpecialOffers.vue";

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
