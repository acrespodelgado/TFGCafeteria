<template>
  <q-page>
    <div v-if="!auth.currentUser">
      <AccessPage />
    </div>
    <div v-else>
      <ChooseCoffeeShopPage />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
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
    return { auth };
  },
});
</script>
