<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <h1 class="q-mb-lg">Inicio de sesión</h1>
      <q-img
        alt="logo UCA"
        src="~/src/assets/uca_logo_horizontal.png"
        style="max-width: 300px; height: auto"
      />
      <form @submit.prevent.stop="onSubmit" class="q-gutter-md q-my-md">
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
          :type="isPwd ? 'password' : 'text'"
          outlined
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
      </form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { db } from "src/boot/firebase";
import { login } from "src/boot/firebaseFunctions";
import { collection, query, where, getDocs } from "firebase/firestore";
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
        remember.value = true; // Marca el toggle
      }
    });

    async function onSubmit() {
      try {
        await login(email.value, password.value);
        $q.notify({ type: "positive", message: "Registro exitoso" });
        router.push("/chooseCoffeeShop");
      } catch (error) {
        $q.notify({ type: "negative", message: error.message });
      }
      /*
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
         */
    }

    return {
      email,
      password,
      isPwd: ref(true),
      remember,
      emailRules,
      onSubmit,
    };
  },
});
</script>
