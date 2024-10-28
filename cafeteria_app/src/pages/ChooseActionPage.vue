<template>
  <div class="q-pa-md example-row-equal-width">
    <div class="row">
      <div class="col-12">
        <h1>Elija el tipo de acción</h1>
      </div>
      <div class="col-6 flex justify-center">
        <q-btn
          color="secondary"
          class="big-button"
          label="Escanear Bono"
          @click="redirect('scan')"
        />
      </div>
      <div class="col-6 flex justify-center">
        <q-btn
          color="secondary"
          class="big-button"
          label="Recargar Bono"
          @click="redirect('recharge')"
        />
      </div>
    </div>
  </div>
  <BackButton />
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import BackButton from "src/layouts/BackButton.vue";

export default defineComponent({
  name: "ChooseActionPage",
  components: {
    BackButton,
  },

  setup() {
    const router = useRouter();

    const redirect = (action) => {
      router.push({ name: "bonusType", query: { action } });
    };

    return {
      redirect,
    };
  },
});
</script>
