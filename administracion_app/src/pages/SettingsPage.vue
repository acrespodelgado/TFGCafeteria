<template>
  <h1>Administrar datos</h1>
  <h2 class="q-pt-none">Seleccione su operación</h2>
  <q-page class="q-pa-xl column justify-center">
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
      <div class="col-12 col-md-6 q-my-md text-center">
        <q-btn
          label="Gestionar Empresas"
          @click="adminCompanies = true"
          color="primary"
          size="xl"
          padding="xl md"
        />
      </div>
    </div>

    <q-dialog v-model="adminBonuses">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Modificar Bonos</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <AdminBonuses />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="adminCompanies">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Gestionar Empresas</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <AdminCompanies />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import AdminBonuses from "src/layouts/AdminBonuses.vue";
import AdminCompanies from "src/layouts/AdminCompanies.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SettingsPage",
  components: {
    AdminBonuses,
    AdminCompanies,
  },

  setup() {
    return {
      adminBonuses: ref(false),
      adminCompanies: ref(false),
    };
  },
});
</script>
