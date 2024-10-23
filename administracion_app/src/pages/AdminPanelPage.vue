<template>
  <q-page class="flex flex-center">
    <h1>Administrar cafetería</h1>
    <div class="q-gutter-md q-my-md column">
      <q-btn
        label="Modificar datos de acceso"
        @click="modifyAccessData = true"
        color="primary"
      />
      <q-btn
        label="Modificar datos de empresa"
        @click="modifyCompanyData = true"
        color="primary"
      />
      <q-btn
        label="Administrar mis cafeterías"
        @click="adminCoffeeShop = true"
        color="primary"
      />
      <q-btn
        label="Administrar mis camareros"
        @click="adminWorkers = true"
        color="primary"
      />
    </div>

    <q-dialog v-model="modifyAccessData">
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

    <q-dialog v-model="modifyCompanyData">
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
  </q-page>
</template>

<script>
import ModifyAccessData from "src/layouts/ModifyAccessData.vue";
import ModifyCompanyData from "src/layouts/ModifyCompanyData.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "adminPanelPage",
  components: {
    ModifyAccessData,
    ModifyCompanyData,
  },

  setup() {
    return {
      modifyAccessData: ref(false),
      modifyCompanyData: ref(false),
    };
  },
});
</script>
