<template>
  <q-page class="flex flex-center">
    <form @submit.prevent.stop="onSubmit" class="q-my-md q-p-0">
      <div class="row">
        <div class="col-6 q-my-md q-pr-xs">
          <q-input
            v-model="name"
            label="Nombre del gestor"
            outlined
            :rules="inputRules"
            lazy-rules
          />
        </div>
        <div class="col-6 q-my-md q-pl-xs">
          <q-input
            v-model="phone"
            label="Teléfono"
            outlined
            :rules="phoneRules"
            lazy-rules
          />
        </div>
        <div class="col-6 q-my-md">
          <q-input
            v-model="companyName"
            label="Nombre de empresa"
            outlined
            :rules="inputRules"
            lazy-rules
          />
        </div>
        <div class="col-6 q-my-md">
          <q-input
            v-model="companyLogo"
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModifyCompanyData",

  setup() {
    return {};
  },
});
</script>
