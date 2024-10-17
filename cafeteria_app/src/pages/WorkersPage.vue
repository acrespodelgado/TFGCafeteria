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
import { db } from "src/boot/firebase";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "WorkersPage",
  setup() {
    const { workers, fetchWorkers } = useWorkers(db);
    const { setSelectedWorker } = useSelectedWorker(); // Obtiene la función para setear el trabajador seleccionado
    const router = useRouter();

    onMounted(() => {
      fetchWorkers();
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
