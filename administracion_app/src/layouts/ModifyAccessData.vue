<template>
  <q-page class="flex flex-center">
    <form @submit.prevent.stop="onSubmit" class="q-my-md q-p-0">
      <div class="row">
        <div class="col-12 q-my-md">
          <q-input
            v-model="accessData.Email"
            label="Email"
            outlined
            :rules="emailRules"
            lazy-rules
          />
        </div>
        <div class="col-6 q-my-md q-pr-xs">
          <q-input
            v-model="accessData.Password"
            label="Nueva contraseña"
            :type="isPwd1 ? 'password' : 'text'"
            outlined
            :rules="passwordRules"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd1 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd1 = !isPwd1"
              />
            </template>
          </q-input>
        </div>
        <div class="col-6 q-my-md q-pl-xs">
          <q-input
            v-model="accessData.RepeatPassword"
            label="Repita la Contraseña"
            :type="isPwd2 ? 'password' : 'text'"
            outlined
            :rules="repeatPasswordRules"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd2 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd2 = !isPwd2"
              />
            </template>
          </q-input>
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
import { auth } from "src/composables/firebaseAuth";
import {
  emailRules,
  passwordRules,
  repeatPasswordRules,
} from "src/composables/rules.js";

export default defineComponent({
  name: "ModifyAccessData",

  setup() {
    const isPwd1 = ref(true);
    const isPwd2 = ref(true);
    const accessData = ref({
      Email: "",
      Password: "",
      RepeatPassword: "",
    });

    accessData.value.Email = auth.currentUser.email;

    const onSubmit = () => {
      // Lógica para manejar la modificación de los datos de acceso
      console.log(
        "Formulario enviado con los siguientes datos:",
        accessData.value
      );
    };

    return {
      accessData,
      isPwd1,
      isPwd2,
      emailRules,
      passwordRules,
      repeatPasswordRules,
      onSubmit,
    };
  },
});
</script>
