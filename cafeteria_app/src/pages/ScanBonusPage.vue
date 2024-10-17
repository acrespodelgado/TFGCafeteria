<template>
  <div class="q-pa-md example-row-equal-width">
    <div class="row">
      <div class="col-12">
        <h1>
          {{
            selectedWorker
              ? "Eres " + selectedWorker.Nombre
              : "No se ha seleccionado un camarero"
          }}
        </h1>
        <h2>Elija el tipo de bono a escanear</h2>
      </div>
      <div
        v-for="(type, id) in bonusType"
        :key="id"
        class="col-6 flex justify-center"
      >
        <q-btn color="primary" class="big-button" :label="type.Nombre" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useBonusType } from "src/components/bonusType";
import { useSelectedWorker } from "src/composables/useSelectedWorker";
import { db } from "src/boot/firebase";

export default defineComponent({
  name: "ScanBonusPage",
  setup() {
    const { bonusType, fetchBonusType } = useBonusType(db);
    const { selectedWorker } = useSelectedWorker(); // Obtiene la función para setear el trabajador seleccionado

    onMounted(() => {
      fetchBonusType();
    });

    return {
      bonusType,
      selectedWorker, //Para que esté disponible en template
    };
  },
});
</script>
