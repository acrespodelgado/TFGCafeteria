<template>
  <h1>Administrar datos</h1>
  <h2 class="q-pt-none">Seleccione su operación</h2>
  <q-page class="flex q-pa-xl column">
    <div class="row">
      <div class="col-12 col-md-6 q-my-md text-center">
        <q-btn
          class="admin-button"
          label="Modificar datos de acceso"
          @click="modifyAccessData = true"
          color="secondary"
          size="xl"
          padding="xl md"
        />
      </div>
      <div class="col-12 col-md-6 q-my-md text-center">
        <q-btn
          class="admin-button"
          label="Modificar datos de empresa"
          @click="modifyCompanyData = true"
          color="secondary"
          size="xl"
          padding="xl md"
        />
      </div>
      <div class="col-12 col-md-6 q-my-md text-center">
        <q-btn
          class="admin-button"
          label="Administrar mis cafeterías"
          @click="adminCoffeeShop = true"
          color="secondary"
          size="xl"
          padding="xl md"
        />
      </div>
      <div class="col-12 col-md-6 q-my-md text-center">
        <q-btn
          class="admin-button"
          label="Administrar mis camareros"
          @click="adminWorkers = true"
          color="secondary"
          size="xl"
          padding="xl md"
        />
      </div>
      <div class="col-12 col-md-6 q-my-md text-center">
        <q-btn
          class="admin-button"
          label="Modificar colores"
          @click="changeColours = true"
          color="secondary"
          size="xl"
          padding="xl md"
        />
      </div>
    </div>

    <q-dialog v-model="modifyAccessData" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Modificar datos de acceso</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <ModifyAccessData />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modifyCompanyData" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Modificar datos de la empresa</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <ModifyCompanyData />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="adminCoffeeShop" persistent>
      <q-card class="adminDialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Administrar cafeterías</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <AdminCoffeeShop />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="adminWorkers" persistent>
      <q-card class="adminDialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Administrar trabajadores</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <AdminWorkers />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="changeColours" persistent>
      <q-card class="adminDialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Modificar colores de la aplicación</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <ChangeColours />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import ModifyAccessData from "src/layouts/ModifyAccessData.vue";
import ModifyCompanyData from "src/layouts/ModifyCompanyData.vue";
import AdminCoffeeShop from "src/layouts/AdminCoffeeShop.vue";
import AdminWorkers from "src/layouts/AdminWorkers.vue";
import ChangeColours from "src/layouts/ChangeColours.vue";

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "adminPanelPage",
  components: {
    ModifyAccessData,
    ModifyCompanyData,
    AdminCoffeeShop,
    AdminWorkers,
    ChangeColours,
  },

  setup() {
    return {
      modifyAccessData: ref(false),
      modifyCompanyData: ref(false),
      adminCoffeeShop: ref(false),
      adminWorkers: ref(false),
      changeColours: ref(false),
    };
  },
});
</script>
