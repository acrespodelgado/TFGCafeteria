<template>
  <q-page class="flex flex-center">
    <h1>Escanear Código QR</h1>
    <h1 v-if="action && mode">Acción: {{ action }} y {{ mode }}</h1>
    <h1 v-else>No se recibió ninguna acción.</h1>
    <qrcode-stream @detect="onDetect"></qrcode-stream>
    <q-card-section v-if="decodedText">
      <p>Código QR escaneado: {{ decodedText }}</p>
    </q-card-section>
    <BackButton />
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import BackButton from "src/layouts/BackButton";
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
    const scanning = ref(false);
    const decodedText = ref("");
    const detectedCodes = ref("");
    /*
    const startScanning = () => {
      scanning.value = true;
    };

    const stopScanning = () => {
      scanning.value = false;
    };

    const onDecode = (result) => {
      decodedText.value = result;
      stopScanning(); // Detiene el escaneo después de escanear
    };

    const onInit = (promise) => {
      console.log("QR Scanner initialized");
    };
    */

    const onDetect = (detectedCodes) => {
      console.log(detectedCodes);
    };

    return {
      action,
      mode,
      //scanning,
      decodedText,
      //startScanning,
      //stopScanning,
      //onDecode,
      //onInit,
      onDetect,
    };
  },
});
</script>
