<template>
  <q-page class="flex flex-center">
    <div v-if="!authenticated">
      <AccessPage />
    </div>
    <div v-else>
      <ChooseCoffeeShopPage />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import AccessPage from "./AccessPage.vue";
import ChooseCoffeeShopPage from "./ChooseCoffeeShopPage.vue";
import { isAuthenticated } from "src/composables/auth";

export default defineComponent({
  name: "IndexPage",
  components: {
    AccessPage,
    ChooseCoffeeShopPage,
  },

  setup() {
    const authenticated = isAuthenticated();

    return {
      authenticated,
    };
  },
});
</script>
