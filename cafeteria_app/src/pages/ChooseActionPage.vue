<template>
  <q-page class="flex flex-center">
    <q-btn color="primary" label="Escanear Bono"
    @click="redirect('scan')" />
    <q-btn color="primary" label="Generar Bono"
    @click="redirect('create')" />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ChooseActionPage',
  setup() {
    const router = useRouter(); // Crea una instancia del router

    const redirect = (action) => {
      if (action === 'scan') {
        router.push({ path: '/scanBonus' }); // Redirige a la ruta de scanBonus
      } else if (action === 'create') {
        router.push({ path: '/createBonus' }); // Redirige a la ruta de createBonus
      }
    };

    return {
      redirect,
    };
  }
})
</script>
