<template>
  <div class="q-pa-md example-row-equal-width">
    <div class="row">
      <h1>{{ selectedWorker? 'No se ha seleccionado un camarero' : selectedWorker.Nombre }}</h1>
      <q-item v-for="(type, id) in bonusType" :key="id">
        <div class="col-6">
          <q-btn color="primary" 
          :label="type.Nombre" />
        </div>
      </q-item>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useBonusType } from 'src/components/bonusType';
import { useSelectedWorker } from 'src/composables/useSelectedWorker';
import { db } from 'src/boot/firebase'

export default defineComponent({
  name: 'ScanBonusPage',
  setup() {
    const { bonusType, fetchBonusType } = useBonusType(db);
    const { selectedWorker } = useSelectedWorker(); // Obtiene la función para setear el trabajador seleccionado

    onMounted(() => {
      fetchBonusType();
    });

    return {
      bonusType,
      selectedWorker //Para que esté disponible en template
    };
  },
});
</script>
