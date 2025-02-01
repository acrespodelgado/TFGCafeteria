<template>
  <h1>Panel de Administración para Empresas</h1>
  <h2 class="q-pt-none">Inicia sesión</h2>
  <q-page>
    <div class="flex flex-center q-pa-xl">
      <form @submit.prevent.stop="onSubmit" class="q-pa-md text-center">
        <div class="q-gutter-md q-my-md">
          <q-input
            v-model="email"
            label="Email"
            outlined
            :rules="emailRules"
            class="q-my-lg"
          />
          <q-input
            v-model="password"
            label="Contraseña"
            :type="isPwd ? 'password' : 'text'"
            outlined
            class="q-mt-lg"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-toggle v-model="remember" label="Recordarme" color="secondary" />
          <q-btn @click="handleResetPassword">Restablecer contraseña</q-btn>
          <div class="q-gutter-md column q-mx-xs">
            <q-btn
              label="Registrarse"
              to="/register"
              color="secondary"
              outline
              rounded
            />
            <q-btn label="Acceder" type="submit" color="primary" rounded />
          </div>
        </div>
      </form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import {
  getCurrentUserData,
  login,
  resetPassword,
} from "src/composables/firebaseAuth";
import { useRouter } from "vue-router";
import { emailRules } from "src/composables/rules";
import { getAuth } from "firebase/auth";

export default defineComponent({
  name: "AccessPage",

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const email = ref(null);
    const password = ref(null);
    const remember = ref(false);

    // Cargar datos de 'Recordarme' si existen
    onMounted(() => {
      const storedEmail =
        localStorage.getItem("email") || sessionStorage.getItem("email");
      const storedPassword =
        localStorage.getItem("password") || sessionStorage.getItem("password");

      if (storedEmail && storedPassword) {
        email.value = storedEmail;
        password.value = storedPassword;
        remember.value = true;
      }
    });

    async function onSubmit() {
      try {
        await login(email.value, password.value);

        // Almacenar credenciales
        if (remember.value) {
          localStorage.setItem("email", email.value);
          localStorage.setItem("password", password.value);
          sessionStorage.setItem("email", email.value);
          sessionStorage.setItem("password", password.value);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          sessionStorage.removeItem("email");
          sessionStorage.removeItem("password");
        }

        // Obtener los datos del usuario
        const data = await getCurrentUserData();
        const hexColor = data.Color;
        const hexColor2 = data.Color_2;

        $q.notify({ type: "positive", message: "Inicio de sesión exitoso" });

        // Aplicar colores personalizados
        applyCustomColor(hexColor, hexColor2);

        // Verificar si el usuario está autenticado antes de proceder
        const auth = getAuth();

        if (!auth.currentUser) {
          router.push("/access"); // Redirige a la página de acceso si no está autenticado
          Notify.create({
            type: "negative",
            message: "Debe iniciar sesión primero.",
            timeout: 1500,
          });
        } else {
          // Si está autenticado, proceder con la verificación del email
          const userEmail = auth.currentUser.email;
          const authorizedEmail = "adrian.crespodelgado@alum.uca.es"; // Email de administrador

          if (userEmail === authorizedEmail) {
            // Redirigir a la página de configuración si es admin
            router.push("/settings");
          } else {
            // Redirigir al panel de administración si no es admin
            router.push("/adminPanel");
          }
        }
      } catch (error) {
        $q.notify({ type: "negative", message: error.message });
      }
    }

    async function handleResetPassword() {
      try {
        await resetPassword(email.value);
        $q.notify({
          type: "positive",
          message: "Email de restablecimiento enviado con éxito",
        });
      } catch (error) {
        $q.notify({ type: "negative", message: error.message });
      }
    }

    const applyCustomColor = (hexColor, hexColor2) => {
      if (hexColor) {
        document.documentElement.style.setProperty("--q-primary", hexColor);
      }
      if (hexColor2) {
        document.documentElement.style.setProperty("--q-secondary", hexColor2);
      }
    };

    return {
      email,
      password,
      isPwd: ref(true),
      remember,
      emailRules,
      onSubmit,
      handleResetPassword,
      login,
    };
  },
});
</script>
