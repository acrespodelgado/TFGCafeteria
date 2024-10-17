<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <h1 class="q-mb-lg">Inicio de sesión</h1>
      <q-img
        alt="logo UCA"
        src="~/src/assets/uca_logo.png"
        style="width: 100px; height: auto"
      />
      <form @submit.prevent.stop="onSubmit" class="q-gutter-md">
        <q-input
          v-model="email"
          label="Email"
          outlined
          :rules="emailRules"
          lazy-rules
        />
        <q-input
          v-model="password"
          label="Contraseña"
          outlined
          :rules="passwordRules"
          lazy-rules
        />
        <q-toggle v-model="remember" label="Recordarme" />
        <q-btn label="Registrarse" to="/register" type="a" />
        <q-btn label="Acceder" type="submit" color="primary" />
      </form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { db } from "src/boot/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AccessPage",

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const email = ref(null);
    const password = ref(null);
    const remember = ref(false);

    const emailRules = [
      (val) => !!val || "* Obligatorio",
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
        "Por favor introduzca un correo electrónico válido", // Validación de formato de correo
    ];

    const passwordRules = [
      (val) => !!val || "* Obligatorio", // Verifica que el campo no esté vacío
      (val) => /[A-Z]/.test(val) || "Debe contener al menos 1 mayúscula", // Verifica al menos 1 letra mayúscula
      (val) => /[0-9]/.test(val) || "Debe contener al menos 1 número", // Verifica al menos 1 dígito
      (val) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(val) ||
        "Debe contener al menos 1 carácter especial", // Verifica al menos 1 carácter especial
    ];

    async function onSubmit() {
      try {
        // Login auth firebase

        $q.notify({
          icon: "error",
          color: "negative",
          message: "PIN o cafetería incorrectos.",
        });
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        $q.notify({
          icon: "error",
          color: "negative",
          message: "Error al intentar acceder. Por favor, inténtelo de nuevo.",
        });
      }
    }
    return {
      passwordRules,
      emailRules,
      onSubmit,
    };
  },
});
</script>
