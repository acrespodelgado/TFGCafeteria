<template>
  <q-page class="flex-center cameraScan">
    <div class="q-pa-md text-center">
      <h1>{{ action === "scan" ? "Escanear" : "Recargar" }}</h1>
      <h2>{{ bonusType }}</h2>
      <div class="scanContainer">
        <qrcode-stream @detect="onDetect"></qrcode-stream>
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
        if (action == "scan" && uses == null) {
          $q.notify({
            message: "No quedan usos disponibles.",
            color: "negative",
            timeout: 3000,
          });
        } else if ((action == "scan" && uses >= 0) || action == "recharge") {
          $q.notify({
            message: "Operación realizada con éxito",
            color: "positive",
            timeout: 5000,
          });
          router.push(`/confirmation/${action}/${bonusType}/${uses}`);
        } else {
          $q.notify({
            message: "No se encontró el tarjetero.",
            color: "negative",
            timeout: 3000,
          });
        }
      } catch (error) {
        $q.notify({
          message: "Error al realizar la operación: " + error,
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
