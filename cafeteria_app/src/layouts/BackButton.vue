<template>
  <div class="back-button-container">
    <q-btn
      label="Volver"
      @click="goBack"
      class="back-button"
      color="secondary"
      rounded
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "BackButton",
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.go(-1); // Regresa a la página anterior
    };

    return {
      goBack,
    };
  },
});
</script>
