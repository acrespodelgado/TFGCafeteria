<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md text-center"
      v-if="selectedCoffeeShop != null && selectedCoffeeShop.value"
    >
      <div class="circlePrimary q-mx-auto">
        <h1>{{ selectedCoffeeShop.Nombre }}</h1>
        <h3 class="q-my-xs">
          Teléfono:
          {{
            selectedCoffeeShop.Telefono
              ? selectedCoffeeShop.Telefono
              : "Por definir"
          }}
        </h3>
        <h3 class="q-my-xs">
          Horario:
          {{
            selectedCoffeeShop.Horario
              ? selectedCoffeeShop.Horario
              : "Por definir"
          }}
        </h3>
        <h3 class="q-my-xs">
          Universidad:
          {{
            selectedCoffeeShop.Universidad
              ? selectedCoffeeShop.Universidad
              : "Por definir"
          }}
        </h3>
      </div>
      <q-card-section v-if="selectedCoffeeShop.Url">
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
        color="secondary"
        class="button q-my-md"
        label="Panel de Gestión"
        href="https://localhost/administrar-cafeteria"
        target="_blank"
        rounded
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
