<template>
  <q-page class="flex flex-center">
    <div v-if="!auth.currentUser">
      <AccessPage />
    </div>
    <div v-else>
      <AdminPanelPage />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import AccessPage from "./AccessPage.vue";
import AdminPanelPage from "./AdminPanelPage.vue";
import { auth } from "src/composables/firebaseAuth";

export default defineComponent({
  name: "IndexPage",
  components: {
    AccessPage,
    AdminPanelPage,
  },

  setup() {
    return { auth };
  },
});
</script>
