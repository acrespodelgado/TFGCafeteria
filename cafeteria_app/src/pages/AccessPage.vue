<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <h1 class="q-mb-lg">Acceso a la cafetería</h1>
      <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset">
        <q-select
          v-model="selectedCoffeeShop"
          :options="coffeeShops"
          transition-show="jump-up"
          transition-hide="jump-up"
          label="Seleccione la cafetería"
          outlined
          :rules="[(val) => !!val || '* Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="coffee" />
          </template>
        </q-select>
        <q-input
          ref="pinRef"
          v-model.number="pin"
          type="password"
          label="Pin de acceso"
          outlined
          :rules="pinRules"
          lazy-rules
        />
        <q-btn label="Acceder" type="submit" color="primary" rounded />
        <q-btn
          label="Limpiar"
          type="reset"
          color="secondary"
          class="q-ml-sm"
          flat
          rounded
        />
      </form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { db } from "src/boot/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter, useRoute } from "vue-router";
import { useCoffeeShop } from "src/components/coffeeShop";
import { useSelectedCoffeeShop } from "src/composables/useSelectedCoffeeShop";
import { pinRules } from "src/composables/rules";

export default defineComponent({
  name: "AccessPage",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const pin = ref(null);
    const pinRef = ref(null);
    const selectedCoffeeShop = ref(null);
    const { coffeeShops, fetchCoffeeShops } = useCoffeeShop();
    const { setSelectedCoffeeShop } = useSelectedCoffeeShop();

    // Función para comprobar el PIN y la cafetería
    async function checkPin(name, pin) {
      const q = query(
        collection(db, "Cafeteria"),
        where("Pin", "==", String(pin)),
        where("Nombre", "==", name)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }

    async function onSubmit() {
      pinRef.value.validate();

      if (pinRef.value.hasError || !selectedCoffeeShop.value) {
        // Si hay errores de validación
        if (!selectedCoffeeShop.value) {
          $q.notify({
            icon: "warning",
            color: "negative",
            message: "Seleccione una cafetería.",
          });
        }
        return;
      }

      try {
        const isValidPin = await checkPin(
          selectedCoffeeShop.value.Nombre,
          pin.value
        );
        if (isValidPin) {
          setSelectedCoffeeShop(selectedCoffeeShop.value);

          const currentTime = Date.now();
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("authTime", currentTime);

          // Estado de carga
          const loadingDuration = 3000; // 3 segundos

          $q.notify({
            icon: "done",
            color: "positive",
            message: "Acceso concedido",
          });

          // Espera 3 segundos antes de redirigir
          setTimeout(() => {
            router.push("/workers");
          }, loadingDuration);
        } else {
          $q.notify({
            icon: "error",
            color: "negative",
            message: "PIN o cafetería incorrectos.",
          });
        }
      } catch (error) {
        console.error("Error al verificar el PIN:", error);
        $q.notify({
          icon: "error",
          color: "negative",
          message: "Error al intentar acceder. Por favor, inténtelo de nuevo.",
        });
      }
    }

    function onReset() {
      pin.value = null;
      selectedCoffeeShop.value = null;
      pinRef.value.resetValidation();
    }

    // Cargar las cafeterías al montar el componente
    onMounted(() => {
      fetchCoffeeShops();
    });

    // Rescatar el mensaje de la URL y mostrarlo con notify
    const message = route.query.message;
    if (message) {
      $q.notify({
        icon: "warning",
        color: "negative",
        message: decodeURIComponent(message),
      });
    }

    return {
      pin,
      pinRef,
      selectedCoffeeShop,
      coffeeShops,
      pinRules,
      onSubmit,
      onReset,
    };
  },
});
</script>
