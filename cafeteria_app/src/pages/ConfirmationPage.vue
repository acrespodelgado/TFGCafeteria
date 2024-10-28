<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <p>Mensaje con datos y confirmacion</p>
      <p>Tipo de bono</p>
      <p>Cantidad de usos restantes:</p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "LoadingPage",

  setup() {
    const $q = useQuasar();

    $q.notify({
      icon: "done",
      color: "positive",
      message: "Operación realizada",
    });

    //Redirigir a bonusType tras 3 segundos
  },
});
</script>
