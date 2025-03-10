<template>
  <q-page>
    <h1>Universidad de Cádiz</h1>
    <h2 class="q-pt-none">Inicia sesión</h2>
    <div class="flex flex-center q-pa-xl">
      <form @submit.prevent.stop="onSubmit" class="q-pa-md text-center">
        <div class="q-gutter-md q-my-md">
          <div id="email">
            <q-input
              v-model="email"
              label="Email"
              outlined
              :rules="emailRules"
              class="q-my-lg"
              input-id="email"
            />
          </div>
          <div id="password">
            <q-input
              v-model="password"
              label="Contraseña"
              :type="isPwd ? 'password' : 'text'"
              outlined
              class="q-mt-lg"
              input-id="password"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
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
            <q-btn
              label="Acceder"
              type="submit"
              color="primary"
              rounded
              id="login-button"
            />
          </div>
        </div>
      </form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { login, resetPassword } from "src/composables/firebaseAuth";
import { useRouter } from "vue-router";
import { emailRules } from "src/composables/rules";

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

        $q.notify({ type: "positive", message: "Inicio de sesión exitoso" });
        router.push("/chooseCoffeeShop");
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
