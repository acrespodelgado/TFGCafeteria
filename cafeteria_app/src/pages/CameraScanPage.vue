<template>
  <q-page class="flex flex-center">
    <h1>Template camera</h1>
    <h1 v-if="action && mode">Acción: {{ action }} y {{ mode }}</h1>
    <h1 v-else>No se recibió ninguna acción.</h1>
    <BackButton />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import BackButton from "src/layouts/BackButton.vue";

export default defineComponent({
  name: "CameraScanPage",
  components: {
    BackButton,
  },

  setup() {
    const route = useRoute();
    const action = route.params.action; // Recupera el parámetro de la ruta
    const mode = route.params.mode; // Recupera el modo (escanear o generar)

    return {
      action,
      mode,
    };
  },
});
</script>
