<template>
  <q-page class="flex flex-center">
    <div v-if="!selectedCoffeeShop">
      <AccessPage />
    </div>
    <div v-else>
      <LoadingPage />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useSelectedCoffeeShop } from "src/composables/useSelectedCoffeeShop";
import AccessPage from "./AccessPage.vue";
import LoadingPage from "./LoadingPage.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    AccessPage,
    LoadingPage,
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
