<template>
  <div class="q-pa-md example-row-equal-width">
    <div class="row">
      <div class="col-12">
        <h1>Seleccione un trabajador</h1>
      </div>
      <div
        v-for="(worker, id) in workers"
        :key="id"
        class="col-6 flex justify-center"
      >
        <q-btn
          color="primary"
          class="big-button"
          :label="worker.Nombre"
          @click="selectWorker(worker)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useWorkers } from "src/components/workers";
import { useSelectedWorker } from "src/composables/useSelectedWorker";
import { useRouter, useRoute } from "vue-router";
import { Notify } from "quasar";

export default defineComponent({
  name: "WorkersPage",

  setup() {
    const { workers, fetchWorkers } = useWorkers();
    const { setSelectedWorker } = useSelectedWorker(); // Función para guardar el trabajador seleccionado
    const router = useRouter();
    const route = useRoute();

    onMounted(() => {
      fetchWorkers();

      // Verificar si hay un mensaje en la URL
      const message = route.query.message;
      if (message) {
        Notify.create({
          message: message,
          color: "negative",
          timeout: 3000,
        });
      }
    });

    const selectWorker = (worker) => {
      setSelectedWorker(worker); // Guarda el trabajador seleccionado en el estado global
      router.push({ path: "/chooseAction" }); // Redirige a la ruta de ChooseActionPage
    };

    return {
      workers,
      selectWorker,
    };
  },
});
</script>
