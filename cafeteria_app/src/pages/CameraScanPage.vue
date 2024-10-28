<template>
  <q-page class="flex flex-center">
    <h1>Escanear Código QR</h1>
    <h1 v-if="bonusType && action">Acción: {{ bonusType }} y {{ action }}</h1>
    <h1 v-else>No se recibió ninguna acción.</h1>
    <qrcode-stream @detect="onDetect"></qrcode-stream>
    <q-card-section v-if="decodedQr">
      <p>Código QR escaneado: {{ decodedQr }}</p>
    </q-card-section>
    <BackButton />
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import BackButton from "src/layouts/BackButton.vue";
import { QrcodeStream } from "vue-qrcode-reader";
import { actionOnWallet } from "src/components/scan";

export default defineComponent({
  name: "CameraScanPage",
  components: {
    BackButton,
    QrcodeStream,
  },

  setup() {
    const route = useRoute();
    const bonusType = route.params.bonusType;
    const action = route.params.action;
    const decodedQr = ref("");
    const testCode =
      "854f5e5a9d6ce3c013f5654df07785bd1ea0760ae2293e93913aef0c3177880c";

    const onDetect = (detectedCodes) => {
      decodedQr.value = detectedCodes[0].rawValue;
    };

    actionOnWallet(testCode, action, bonusType);

    return {
      bonusType,
      action,
      decodedQr,
      onDetect,
    };
  },
});
</script>
