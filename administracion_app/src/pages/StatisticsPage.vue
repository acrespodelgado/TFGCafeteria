<template>
  <h1>Consulta estadísticas generales de nuestras cafeterías</h1>
  <h2 class="q-pt-none">Listado de Métricas</h2>
  <q-page>
    <div class="q-pa-sm text-center"></div>
    <BackButton />
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import BackButton from "src/layouts/BackButton.vue";

export default defineComponent({
  name: "StatisticsPage",
  components: {
    BackButton,
  },

  setup() {
    onMounted(() => {});

    return {};
  },
});
</script>
