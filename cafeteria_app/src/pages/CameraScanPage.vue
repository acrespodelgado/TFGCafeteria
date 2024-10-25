<template>
  <q-page class="flex flex-center">
    <h1>Escanear Código QR</h1>
    <h1 v-if="action && mode">Acción: {{ action }} y {{ mode }}</h1>
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

export default defineComponent({
  name: "CameraScanPage",
  components: {
    BackButton,
    QrcodeStream,
  },

  setup() {
    const route = useRoute();
    const action = route.params.action; // Recupera el parámetro de la ruta
    const mode = route.params.mode; // Recupera el modo (escanear o generar)
    const decodedQr = ref("");

    const onDetect = (detectedCodes) => {
      window.alert(detectedCodes[0].rawValue);
      decodedQr.value = detectedCodes[0].rawValue;
    };

    return {
      action,
      mode,
      decodedQr,
      onDetect,
    };
  },
});
</script>
