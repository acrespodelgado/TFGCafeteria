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

    // Cargar datos de 'Recordarme' si existen
    onMounted(() => {
      const storedEmail =
        localStorage.getItem("email") || sessionStorage.getItem("email");
      const storedPassword =
        localStorage.getItem("password") || sessionStorage.getItem("password");

      if (storedEmail && storedPassword) {
        email.value = storedEmail;
        password.value = storedPassword;
        remember.value = true; // Marca el toggle
      }
    });

    async function onSubmit() {
      try {
        // Consulta a Firestore para verificar el email y la contraseña
        // Cambiar por firebase auth
        const alumnoCol = collection(db, "alumno");
        const q = query(
          alumnoCol,
          where("email", "==", email.value),
          where("password", "==", password.value)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Inicio de sesión exitoso
          if (remember.value) {
            localStorage.setItem("email", email.value);
            localStorage.setItem("password", password.value);
          } else {
            sessionStorage.setItem("email", email.value);
            sessionStorage.setItem("password", password.value);
          }

          $q.notify({
            icon: "check_circle",
            color: "positive",
            message: "Inicio de sesión exitoso",
          });
          // Redirección al selector de cafeterías
          router.push("/chooseCoffeeShop");
        } else {
          $q.notify({
            icon: "error",
            color: "negative",
            message: "Email o contraseña incorrectos.",
          });
        }
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
      email,
      password,
      remember,
      passwordRules,
      emailRules,
      onSubmit,
    };
  },
});
</script>
