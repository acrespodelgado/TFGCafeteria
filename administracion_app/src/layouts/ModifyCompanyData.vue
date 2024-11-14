<template>
  <div class="flex flex-center">
    <form @submit.prevent.stop="onSubmit" class="q-my-md q-p-0">
      <div class="row">
        <div class="col-6 q-my-md q-pr-xs">
          <q-input
            v-model="companyData.Propietario"
            label="Nombre del gestor"
            outlined
            :rules="inputRules"
          />
        </div>
        <div class="col-6 q-my-md q-pl-xs">
          <q-input
            v-model="companyData.Telefono"
            label="Teléfono"
            outlined
            :rules="phoneRules"
            type="number"
          />
        </div>
        <div class="col-6 q-my-md q-pr-xs">
          <q-input
            v-model="companyData.Nombre"
            label="Nombre de empresa"
            outlined
            :rules="inputRules"
            disable
          />
        </div>
        <div class="col-6 q-my-md q-pl-xs">
          <q-input v-model="companyData.Url" label="Url del logo" outlined />
        </div>
      </div>

      <div class="q-gutter-md q-my-md column">
        <q-btn label="Modificar" type="submit" color="primary" />
      </div>
    </form>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { getCurrentUserData } from "src/composables/firebaseAuth";
import { inputRules, phoneRules } from "src/composables/rules.js";
import { useQuasar } from "quasar";
import { updateCompanyData } from "src/components/company";

export default defineComponent({
  name: "ModifyCompanyData",

  setup() {
    const $q = useQuasar();

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

    async function onSubmit() {
      if (
        !companyData.value.Propietario ||
        !companyData.value.Telefono ||
        !companyData.value.Nombre
      ) {
        $q.notify({
          type: "negative",
          message: "Rellene los campos obligatorios",
        });
        return;
      }

      const updatedData = {
        Propietario: companyData.value.Propietario,
        Nombre: companyData.value.Nombre,
        Telefono: companyData.value.Telefono,
        Url: companyData.value.Url,
      };

      // Validar teléfono
      const phoneIsValid = phoneRules.every(
        (rule) => rule(companyData.value.Telefono) === true
      );

      if (!phoneIsValid) {
        $q.notify({
          type: "negative",
          message: "El teléfono no cumple con las reglas de validación",
        });
        return;
      }

      const success = await updateCompanyData(
        companyData.value.Uid,
        updatedData
      );

      if (success) {
        $q.notify({
          type: "positive",
          message: "Datos de la empresa actualizados correctamente",
        });
      } else {
        $q.notify({
          type: "negative",
          message: "Error al actualizar los datos de la empresa",
        });
      }
    }

    return {
      companyData,
      inputRules,
      phoneRules,
      onSubmit,
    };
  },
});
</script>
