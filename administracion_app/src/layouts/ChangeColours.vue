<template>
  <div class="q-pa-md column">
    <form @submit.prevent.stop="onSubmit" class="text-center">
      <div class="q-my-xs">
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
        ></q-input>
        <div class="text-left q-my-md">
          <span class="h5-text">Color de texto</span>
          <q-radio
            class="q-ml-md"
            v-model="hexColorText"
            val="#FFF"
            label="Blanco"
          />
          <q-radio
            class="q-ml-md"
            v-model="hexColorText"
            val="#000"
            label="Negro"
          />
        </div>

        <q-btn
          label="Actualizar Colores"
          type="submit"
          color="primary"
          class="q-m-sm"
        />
        <q-btn
          label="Restablecer Colores"
          @click="resetColors"
          color="secondary"
          class="q-ma-sm"
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
    const hexColorText = ref(null);

    async function onMounted() {
      data.value = await getCurrentUserData();
      hexColor.value = data.value.Color || ""; // Valores iniciales si existen
      hexColor2.value = data.value.Color_2 || "";
      hexColorText.value = data.value.Color_Text || "";
    }

    onMounted();

    async function onSubmit() {
      try {
        await updateCompanyColors(
          data.value.Uid,
          hexColor.value,
          hexColor2.value,
          hexColorText.value
        );

        $q.notify({
          type: "positive",
          message: "Colores modificados con éxito",
        });

        applyCustomColor(hexColor.value, hexColor2.value, hexColorText.value);
      } catch (error) {
        $q.notify({ type: "negative", message: error.message });
      }
    }

    async function resetColors() {
      try {
        await updateCompanyColors(data.value.Uid, null, null, null);

        hexColor.value = null;
        hexColor2.value = null;
        hexColorText.value = null;
        applyCustomColor(null, null, null);

        $q.notify({
          type: "positive",
          message: "Colores restablecidos a valores predeterminados.",
        });
      } catch (error) {
        $q.notify({ type: "negative", message: error.message });
      }
    }

    const applyCustomColor = (hexColor, hexColor2, hexColorText) => {
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
      if (hexColorText) {
        document.documentElement.style.setProperty("--q-accent", hexColorText);
      } else {
        document.documentElement.style.removeProperty("--q-accent");
      }
    };

    return {
      hexColor,
      hexColor2,
      hexColorText,
      onMounted,
      onSubmit,
      resetColors,
    };
  },
});
</script>
