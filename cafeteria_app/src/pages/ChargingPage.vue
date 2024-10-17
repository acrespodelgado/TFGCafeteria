<template>
  <q-page class="flex flex-center">
    <div v-if="selectedCoffeeShop != null && selectedCoffeeShop.value">
      <h1>{{ selectedCoffeeShop.label }}</h1>
      <q-img
        :alt="selectedCoffeeShop.label"
        :src="selectedCoffeeShop.url"
        style="width: 300px; height: auto"
      />
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

    // En template uso : o v-bind para mostrar los datos
    console.log(selectedCoffeeShop);
    return {
      selectedCoffeeShop,
    };
  },
});
</script>
