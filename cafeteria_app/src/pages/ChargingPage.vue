<template>
  <q-page class="flex flex-center">
    <div v-if="selectedCoffeeShop != null && selectedCoffeeShop.value">
      <h1 class="text-center">{{ selectedCoffeeShop.label }}</h1>
      <q-card-section>
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-img
            :alt="selectedCoffeeShop.label"
            :src="selectedCoffeeShop.url"
            style="width: 300px; height: auto"
          />
        </transition>
      </q-card-section>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useSelectedCoffeeShop } from "src/composables/useSelectedCoffeeShop";

export default defineComponent({
  name: "ChargingPage",

  setup() {
    const { selectedCoffeeShop } = useSelectedCoffeeShop();

    return {
      selectedCoffeeShop,
    };
  },
});
</script>
