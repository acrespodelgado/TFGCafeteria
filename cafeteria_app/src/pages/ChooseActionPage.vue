<template>
  <div class="q-pa-md example-row-equal-width">
    <div class="row">
      <div class="col-12">
        <h1>Elija el tipo de acción</h1>
      </div>
      <div class="col-6 flex justify-center">
        <q-btn
          color="primary"
          class="big-button"
          label="Escanear Bono"
          @click="redirect('scan')"
        />
      </div>
      <div class="col-6 flex justify-center">
        <q-btn
          color="primary"
          class="big-button"
          label="Generar Bono"
          @click="redirect('create')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ChooseActionPage",
  setup() {
    const router = useRouter(); // Crea una instancia del router

    const redirect = (action) => {
      if (action === "scan") {
        router.push({ path: "/scanBonus" }); // Redirige a la ruta de scanBonus
      } else if (action === "create") {
        router.push({ path: "/createBonus" }); // Redirige a la ruta de createBonus
      }
    };

    return {
      redirect,
    };
  },
});
</script>
