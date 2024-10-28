<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md text-center">
      <h1 v-if="action && bonusType">
        Se ha {{ action === "scan" ? "escaneado" : "recargado" }}
        {{ bonusType }} con éxito
      </h1>
      <h2>Cantidad de usos restantes: {{ uses ? uses : "No disponible" }}</h2>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "ConfirmationPage",

  setup() {
    const route = useRoute();
    const router = useRouter();
    const action = route.params.action;
    const bonusType = route.params.bonusType;
    const uses = route.params.uses;
    const loadingDuration = 6000;

    setTimeout(() => {
      router.push("/workers");
    }, loadingDuration);
    return {
      bonusType,
      action,
      uses,
    };
  },
});
</script>
