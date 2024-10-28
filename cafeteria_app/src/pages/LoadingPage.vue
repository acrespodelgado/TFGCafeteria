<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md text-center"
      v-if="selectedCoffeeShop != null && selectedCoffeeShop.value"
    >
      <h1 class="text-center">{{ selectedCoffeeShop.Nombre }}</h1>
      <h2>
        Teléfono:
        {{
          selectedCoffeeShop.Telefono
            ? selectedCoffeeShop.Telefono
            : "Por definir"
        }}
      </h2>
      <h2>
        Horario:
        {{
          selectedCoffeeShop.Horario
            ? selectedCoffeeShop.Horario
            : "Por definir"
        }}
      </h2>
      <q-card-section>
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-img
            :alt="selectedCoffeeShop.Nombre"
            :src="selectedCoffeeShop.Url"
            style="width: 300px; height: auto"
          />
        </transition>
      </q-card-section>
      <q-btn
        color="primary"
        class="button"
        label="Panel de Gestión"
        href="https://localhost/administrar-cafeteria"
        target="_blank"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useSelectedCoffeeShop } from "src/composables/useSelectedCoffeeShop";

export default defineComponent({
  name: "LoadingPage",

  setup() {
    const { selectedCoffeeShop } = useSelectedCoffeeShop();

    return {
      selectedCoffeeShop,
    };
  },
});
</script>
