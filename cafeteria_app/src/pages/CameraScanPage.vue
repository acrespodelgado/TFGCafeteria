<template>
  <q-page class="flex-center cameraScan">
    <div class="q-pa-md text-center">
      <h1>{{ action === "scan" ? "Escanear" : "Recargar" }} {{ bonusType }}</h1>
      <div class="scanContainer">
        <qrcode-stream @detect="onDetect"></qrcode-stream>
        <q-card-section v-if="decodedQr">
          <p>Código QR escaneado: {{ decodedQr }}</p>
        </q-card-section>
      </div>
      <h2>Escanee el código QR</h2>
      <BackButton />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BackButton from "src/layouts/BackButton.vue";
import { QrcodeStream } from "vue-qrcode-reader";
import { actionOnWallet } from "src/components/scan";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "CameraScanPage",
  components: {
    BackButton,
    QrcodeStream,
  },

  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const bonusType = route.params.bonusType;
    const action = route.params.action;
    const decodedQr = ref("");

    const onDetect = async (detectedCodes) => {
      decodedQr.value = detectedCodes[0].rawValue;

      try {
        const uses = await actionOnWallet(decodedQr, action, bonusType);

        $q.notify({
          message: "Operación realizada con éxito",
          color: "positive",
          timeout: 5000,
        });
        router.push(`/confirmation/${action}/${bonusType}/${uses}`);
      } catch (error) {
        $q.notify({
          message: "Error al realizar la operación",
          color: "negative",
          timeout: 3000,
        });
      }
    };

    return {
      bonusType,
      action,
      decodedQr,
      onDetect,
    };
  },
});
</script>
