<template>
  <q-page class="flex flex-center">
    <form @submit.prevent.stop="onSubmit" class="q-my-md q-p-0">
      <div class="row">
        <div class="col-6 q-my-md q-pr-xs">
          <q-input
            v-model="companyData.Propietario"
            label="Nombre del gestor"
            outlined
            :rules="inputRules"
            lazy-rules
          />
        </div>
        <div class="col-6 q-my-md q-pl-xs">
          <q-input
            v-model="companyData.Telefono"
            label="Teléfono"
            outlined
            :rules="phoneRules"
            lazy-rules
          />
        </div>
        <div class="col-6 q-my-md q-pr-xs">
          <q-input
            v-model="companyData.Nombre"
            label="Nombre de empresa"
            outlined
            :rules="inputRules"
            lazy-rules
          />
        </div>
        <div class="col-6 q-my-md q-pl-xs">
          <q-input
            v-model="companyData.Url"
            label="Url del logo"
            outlined
            :rules="inputRules"
            lazy-rules
          />
        </div>
      </div>

      <div class="q-gutter-md q-my-md column">
        <q-btn label="Modificar" type="submit" color="primary" />
      </div>
    </form>
  </q-page>
</template>
<script>
import { defineComponent, ref } from "vue";
import { getCurrentUserData } from "src/composables/firebaseAuth";
import { inputRules, phoneRules } from "src/composables/rules.js";

export default defineComponent({
  name: "ModifyCompanyData",

  setup() {
    const companyData = ref({
      Propietario: "",
      Nombre: "",
      Telefono: "",
      Url: "",
    });

    async function fetchCompanyData() {
      const data = await getCurrentUserData();
      companyData.value = { ...data };
    }

    fetchCompanyData();

    return {
      companyData,
      inputRules,
      phoneRules,
    };
  },
});
</script>
