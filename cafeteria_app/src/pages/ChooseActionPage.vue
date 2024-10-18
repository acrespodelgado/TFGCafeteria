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
  <BackButton />
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import BackButton from "src/layouts/BackButton";

export default defineComponent({
  name: "ChooseActionPage",
  components: {
    BackButton,
  },

  setup() {
    const router = useRouter(); // Crea una instancia del router

    const redirect = (action) => {
      // Redirige según la acción y pasa el parámetro
      router.push({ name: "typeBonus", query: { action } });
    };

    return {
      redirect,
    };
  },
});
</script>
