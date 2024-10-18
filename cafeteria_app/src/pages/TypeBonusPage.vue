<template>
  <div class="q-pa-md example-row-equal-width">
    <div class="row">
      <div class="col-12">
        <h1>
          {{
            selectedWorker
              ? "Eres " + selectedWorker.Nombre
              : "No se ha seleccionado un camarero"
          }}
        </h1>
        <h2>
          Elija el tipo de bono a
          {{ action === "scan" ? "escanear" : "generar" }}
        </h2>
      </div>
      <div
        v-for="(type, id) in bonusType"
        :key="id"
        class="col-6 flex justify-center"
      >
        <q-btn
          color="primary"
          class="big-button"
          :label="type.Nombre"
          @click="navigateToCamera(type.Nombre)"
        />
      </div>
    </div>
  </div>
  <BackButton />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useBonusType } from "src/components/bonusType";
import { db } from "src/boot/firebase";
import { useRouter, useRoute } from "vue-router";
import { useRedirectIfNoWorker } from "src/composables/redirectNotSelectedWorker";
import { useSelectedWorker } from "src/composables/useSelectedWorker";
import BackButton from "src/layouts/BackButton";

export default defineComponent({
  name: "BonusTypeLayout",
  components: {
    BackButton,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const action = route.query.action;
    const { bonusType, fetchBonusType } = useBonusType(db);
    const { redirectIfNoWorker } = useRedirectIfNoWorker();
    const { selectedWorker } = useSelectedWorker(); // Obtiene el trabajador seleccionado

    if (!redirectIfNoWorker()) {
      return; // Redirijo para obligar a elegir camarero
    }

    onMounted(() => {
      fetchBonusType();
    });

    const navigateToCamera = (type) => {
      router.push({
        name: "cameraScan",
        params: { action: type, mode: action },
      });
    };

    return {
      bonusType,
      navigateToCamera,
      selectedWorker,
      action,
    };
  },
});
</script>
