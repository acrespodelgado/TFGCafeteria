<template>
  <q-page class="flex flex-center">
    <form @submit.prevent.stop="onSubmit" class="q-pa-md">
      <h1 class="q-mb-lg">Inicio de sesión</h1>
      <q-img
        alt="logo UCA"
        src="~/src/assets/uca_logo_horizontal.png"
        style="max-width: 300px; height: auto"
      />
      <div class="q-gutter-md q-my-md">
        <q-input
          v-model="email"
          label="Email"
          outlined
          :rules="emailRules"
          lazy-rules
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

        <q-toggle v-model="remember" label="Recordarme" />
        <div class="q-gutter-md column q-mx-xs">
          <q-btn label="Registrarse" to="/register" type="a" />
          <q-btn label="Acceder" type="submit" color="primary" />
        </div>
      </div>
    </form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { login } from "src/composables/firebaseAuth";
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

    return {
      email,
      password,
      isPwd: ref(true),
      remember,
      emailRules,
      onSubmit,
      login,
    };
  },
});
</script>
