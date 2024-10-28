<template>
  <div class="q-pa-md example-row-equal-width">
    <div class="row">
      <div class="col-12">
        <h1>Seleccione un trabajador</h1>
      </div>
      <div
        v-for="(worker, id) in filteredWorkers"
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
import { defineComponent, onMounted, computed } from "vue";
import { useWorkers } from "src/components/workers";
import { useSelectedWorker } from "src/composables/useSelectedWorker";
import { useSelectedCoffeeShop } from "src/composables/useSelectedCoffeeShop";
import { useRedirectIfNoCoffeeShop } from "src/composables/redirect";
import { useRouter, useRoute } from "vue-router";
import { Notify } from "quasar";

export default defineComponent({
  name: "WorkersPage",

  setup() {
    const { workers, fetchWorkers } = useWorkers();
    const { setSelectedWorker } = useSelectedWorker();
    const { selectedCoffeeShop } = useSelectedCoffeeShop();
    const { redirectIfNoCoffeeShop } = useRedirectIfNoCoffeeShop();
    const router = useRouter();
    const route = useRoute();

    if (!redirectIfNoCoffeeShop()) {
      return; // Redirijo para obligar a elegir cafeteria
    }

    // Antes de cargar el componente se filtra por camareros de esa empresa
    const filteredWorkers = computed(() => {
      return workers.value.filter(
        (worker) => worker.Empresa === selectedCoffeeShop.value?.Empresa
      );
    });

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
      setSelectedWorker(worker);
      router.push({ path: "/chooseAction" });
    };

    return {
      filteredWorkers,
      selectWorker,
    };
  },
});
</script>
