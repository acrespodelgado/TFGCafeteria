<template>
  <h1>Administrar datos</h1>
  <h2 class="q-pt-none">Seleccione su operación</h2>
  <q-page class="q-pa-xl column justify-end">
    <div class="row">
      <div class="col-12 col-md-6 q-my-md text-center">
        <q-btn
          label="Modificar tipos de Bono"
          @click="adminBonuses = true"
          color="primary"
          size="xl"
          padding="xl md"
        />
      </div>
    </div>

    <q-dialog v-model="adminBonuses">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Modificar datos de acceso</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <AdminBonuses />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import AdminBonuses from "src/layouts/AdminBonuses.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SettingsPage",
  components: {
    AdminBonuses,
  },

  setup() {
    return {
      adminBonuses: ref(false),
    };
  },
});
</script>
