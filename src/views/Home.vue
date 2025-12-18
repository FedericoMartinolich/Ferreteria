<template>
  <div>
    <NewProducts v-if="notNull(newProductsEvent)" :data="newProductsEvent[0]"/>
    <Christmas v-if="notNull(christmasEvent)" :data="christmasEvent[0]"/>
    <SpecialOffers v-if="notNull(specialOffersEvent)" :data="specialOffersEvent[0]"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getEvents } from "../services/events.js"
/* Divs */
import Christmas from "../components/Div/Christmas.vue";
import NewProducts from "../components/Div/NewProducts.vue";
import SpecialOffers from "../components/Div/SpecialOffers.vue";

const events = ref([]);
const christmasEvent = ref([]);
const newProductsEvent = ref([]);
const specialOffersEvent = ref([]);

const notNull = (value) => value && value.length > 0;

onMounted(async () => {
  const data = await getEvents();
  const activeEvents = data
    .filter(event => event.active === "1")
    .map(event => ({
    ...event,
    product_ids: event.product_ids.split("|"),
    }));
  events.value = activeEvents;

  christmasEvent.value = activeEvents.filter(event => event.event_key === "christmas");
  newProductsEvent.value = activeEvents.filter(event => event.event_key === "new");  
  specialOffersEvent.value = activeEvents.filter(event => event.event_key === "offers");
});

</script>
