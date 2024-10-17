<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <form
        @submit.prevent.stop="onSubmit"
        @reset.prevent.stop="onReset"
        class="q-gutter-md"
      >
        <q-select
          v-model="selectedCoffeeShop"
          :options="coffeeShops"
          label="Seleccione la cafetería"
          outlined
          :rules="[(val) => !!val || '* Obligatorio']"
        />
        <q-input
          ref="pinRef"
          v-model.number="pin"
          type="number"
          label="Pin de acceso"
          outlined
          :rules="pinRules"
          lazy-rules
        />
        <q-btn label="Acceder" type="submit" color="primary" />
        <q-btn
          label="Limpiar"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
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
import { useRouter } from "vue-router";
import { useCoffeeShop } from "src/components/coffeeShop";

export default defineComponent({
  name: "AccessPage",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const pin = ref(null);
    const pinRef = ref(null);
    const selectedCoffeeShop = ref(null);
    const { coffeeShops, fetchCoffeeShops } = useCoffeeShop(db);

    const pinRules = [
      (val) => !!val || "* Obligatorio",
      (val) => String(val).length === 4 || "Por favor introduzca 4 dígitos", // Validación de 4 dígitos
    ];

    // Función para comprobar el PIN y la cafetería
    async function checkPin(name, pin) {
      const q = query(
        collection(db, "Cafeteria"),
        where("Pin", "==", pin),
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
        console.log(selectedCoffeeShop);
        const isValidPin = await checkPin(
          selectedCoffeeShop.value.label,
          pin.value
        );
        if (isValidPin) {
          const currentTime = Date.now();
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("authTime", currentTime);

          $q.notify({
            icon: "done",
            color: "positive",
            message: "Acceso concedido",
          });
          router.push("/workers"); // Redirige a workers
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
    onMounted(fetchCoffeeShops);

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
