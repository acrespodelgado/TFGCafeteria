<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="q-mb-lg">Registro de usuario</h1>
          <q-img
            alt="logo UCA"
            src="~/src/assets/uca_logo_horizontal.png"
            style="max-width: 300px; height: auto"
          />
        </div>
      </div>
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
            <q-input v-model="name" label="Nombre" outlined />
          </div>
          <div class="col-6 q-my-md q-pl-xs">
            <q-input v-model="surname" label="Apellidos" outlined />
          </div>
          <div class="col-12 q-my-md">
            <q-input
              v-model="dni"
              label="DNI"
              outlined
              :rules="dniRules"
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
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { db } from "src/boot/firebase";
import { register } from "src/boot/firebaseFunctions";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";
import { emailRules, passwordRules, dniRules } from "src/composables/rules";
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
    const surname = ref(null);
    const dni = ref(null);

    async function onSubmit() {
      await register(email.value, password.value);
      $q.notify({
        icon: "check_circle",
        color: "positive",
        message: "Registro exitoso",
      });
      // Redirección al selector de cafeterías
      router.push("/access");
    }

    return {
      email,
      password,
      repeat_password,
      name,
      surname,
      dni,
      isPwd1: ref(true),
      isPwd2: ref(true),
      emailRules,
      passwordRules,
      dniRules,
      onSubmit,
    };
  },
});
</script>
