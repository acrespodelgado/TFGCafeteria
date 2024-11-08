<template>
  <div class="q-pa-md">
    <form @submit.prevent.stop="onSubmit" class="q-pa-md text-center">
      <div class="q-gutter-md q-my-md">
        <q-input
          v-model="hexColor"
          label="Color Hexadecimal Principal"
          outlined
          class="q-my-lg"
          placeholder="#FFFFFF"
        />
        <q-input
          v-model="hexColor2"
          label="Color Hexadecimal Secundario"
          outlined
          class="q-mt-lg"
          placeholder="#FFFFFF"
        >
        </q-input>
        <q-btn
          label="Actualizar Colores"
          type="submit"
          color="primary"
          class="q-my-md"
        />
        <q-btn
          label="Restablecer Colores"
          @click="resetColors"
          color="secondary"
          class="q-my-md"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { getCurrentUserData } from "src/composables/firebaseAuth";
import { updateCompanyColors } from "src/components/company";

export default defineComponent({
  name: "AccessPage",

  setup() {
    const $q = useQuasar();
    const data = ref();
    const hexColor = ref(null);
    const hexColor2 = ref(null);

    async function onMounted() {
      data.value = await getCurrentUserData();
      hexColor.value = data.value.Color || ""; // Valores iniciales si existen
      hexColor2.value = data.value.Color_2 || "";
    }

    onMounted();

    async function onSubmit() {
      try {
        await updateCompanyColors(
          data.value.Nombre,
          hexColor.value,
          hexColor2.value
        );

        $q.notify({
          type: "positive",
          message: "Colores modificados con éxito",
        });

        applyCustomColor(hexColor.value, hexColor2.value);
      } catch (error) {
        $q.notify({ type: "negative", message: error.message });
      }
    }

    async function resetColors() {
      try {
        await updateCompanyColors(data.value.Nombre, null, null);

        hexColor.value = null;
        hexColor2.value = null;
        applyCustomColor(null, null);

        $q.notify({
          type: "positive",
          message: "Colores restablecidos a valores predeterminados.",
        });
      } catch (error) {
        $q.notify({ type: "negative", message: error.message });
      }
    }

    const applyCustomColor = (hexColor, hexColor2) => {
      if (hexColor) {
        document.documentElement.style.setProperty("--q-primary", hexColor);
      } else {
        document.documentElement.style.removeProperty("--q-primary");
      }
      if (hexColor2) {
        document.documentElement.style.setProperty("--q-secondary", hexColor2);
      } else {
        document.documentElement.style.removeProperty("--q-secondary");
      }
    };

    return {
      hexColor,
      hexColor2,
      onMounted,
      onSubmit,
      resetColors,
    };
  },
});
</script>
