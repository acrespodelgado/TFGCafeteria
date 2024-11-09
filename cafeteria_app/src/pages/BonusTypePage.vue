<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-12">
        <h1>
          {{
            selectedWorker
              ? selectedWorker.Nombre
              : "No se ha seleccionado un camarero"
          }}
        </h1>
        <h2>
          Tipo de bono a
          {{ action === "scan" ? "escanear" : "recargar" }}
        </h2>
      </div>
      <div
        v-for="(type, id) in bonusType"
        :key="id"
        class="col-6 flex justify-center"
      >
        <q-btn
          color="secondary"
          class="big-button q-btn-icon-right"
          :label="type.Nombre"
          :icon-right="type.Icono"
          icon-size="lg"
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
import { useRouter, useRoute } from "vue-router";
import { useRedirectIfNoWorker } from "src/composables/redirect";
import { useSelectedWorker } from "src/composables/useSelectedWorker";
import BackButton from "src/layouts/BackButton.vue";

export default defineComponent({
  name: "BonusTypePage",
  components: {
    BackButton,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const action = route.query.action;
    const { bonusType, fetchBonusType } = useBonusType();
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
        params: { bonusType: type, action: action },
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
