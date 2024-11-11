<template>
  <h1>Panel de Administración para Empresas</h1>
  <h2 class="q-pt-none">Registrarse</h2>
  <q-page>
    <div class="flex flex-center q-pa-xl">
      <form @submit.prevent.stop="onSubmit" class="q-my-md q-p-0">
        <div class="row">
          <div class="col-12 q-my-md">
            <q-input
              v-model="email"
              label="Email"
              outlined
              :rules="emailRules"
              lazy-rules
            />
          </div>
          <div class="col-6 q-my-md q-pr-xs">
            <q-input
              v-model="password"
              label="Contraseña"
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
              v-model="repeat_password"
              label="Repita la Contraseña"
              :type="isPwd2 ? 'password' : 'text'"
              outlined
              :rules="repeatPasswordRules(password)"
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
          <div class="col-12 q-my-md">
            <q-input
              v-model="companyName"
              label="Nombre de empresa"
              outlined
              :rules="inputRules"
              lazy-rules
            />
          </div>
        </div>

        <div class="q-gutter-md q-my-md column">
          <q-btn label="Enviar" type="submit" color="primary" />
        </div>
      </form>
    </div>
    <BackButton />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { registerCompany } from "src/composables/firebaseAuth";
import { useRouter } from "vue-router";
import {
  emailRules,
  passwordRules,
  dniRules,
  phoneRules,
  validateForm,
  inputRules,
  repeatPasswordRules,
} from "src/composables/rules";
import BackButton from "src/layouts/BackButton.vue";

export default defineComponent({
  name: "RegisterPage",
  components: {
    BackButton,
  },

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const email = ref(null);
    const password = ref(null);
    const repeat_password = ref(null);
    const name = ref(null);
    const companyName = ref(null);
    const phone = ref(null);

    async function onSubmit() {
      const inputs = [
        email.value,
        password.value,
        repeat_password.value,
        name.value,
        companyName.value,
        phone.value,
      ];

      const valid = await validateForm(inputs);

      if (valid) {
        try {
          await registerCompany(
            email.value,
            password.value,
            name.value,
            companyName.value,
            phone.value
          );
          $q.notify({
            icon: "check_circle",
            color: "positive",
            message: "Registro exitoso",
          });

          router.push("/access");
        } catch (error) {
          $q.notify({
            icon: "error",
            color: "negative",
            message: "Error en el registro: " + error.message,
          });
        }
      } else {
        $q.notify({
          icon: "error",
          color: "negative",
          message: "Error en el registro, revise el formulario",
        });
      }
    }

    return {
      email,
      password,
      repeat_password,
      name,
      companyName,
      phone,
      isPwd1: ref(true),
      isPwd2: ref(true),
      emailRules,
      passwordRules,
      repeatPasswordRules,
      inputRules,
      dniRules,
      phoneRules,
      onSubmit,
    };
  },
});
</script>
