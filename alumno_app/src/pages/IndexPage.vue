<template>
  <q-page class="flex flex-center">
    <div v-if="!auth">
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
import { auth } from "src/composables/firebaseAuth";

export default defineComponent({
  name: "IndexPage",
  components: {
    AccessPage,
    ChooseCoffeeShopPage,
  },

  setup() {
    return {};
  },
});
</script>
