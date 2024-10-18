<template>
  <q-page class="flex flex-center">
    <div v-if="!selectedCoffeeShop">
      <AccessPage />
    </div>
    <div v-else>
      <ChargingPage />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useSelectedCoffeeShop } from "src/composables/useSelectedCoffeeShop";
import AccessPage from "./AccessPage.vue";
import ChargingPage from "./ChargingPage.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    AccessPage,
    ChargingPage,
  },

  setup() {
    const { selectedCoffeeShop } = useSelectedCoffeeShop();
    const loading = ref(false);

    return {
      selectedCoffeeShop,
      loading,
    };
  },
});
</script>
