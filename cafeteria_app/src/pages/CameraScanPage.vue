<template>
  <q-page class="flex flex-center">
    <h1>Template camera</h1>
    <h1 v-if="action && mode">Acción: {{ action }} y {{ mode }}</h1>
    <h1 v-else>No se recibió ninguna acción.</h1>
    <!-- Aquí puedes agregar la lógica según la acción -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "CameraScanPage",
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
