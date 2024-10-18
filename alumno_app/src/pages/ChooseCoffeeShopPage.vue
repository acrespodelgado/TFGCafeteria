<template>
  <q-page class="flex flex-center">
    <h1>Elige tu cafetería</h1>

    <q-carousel
      v-if="!isLoading"
      v-model="currentCoffeeShop"
      vertical
      swipeable
      animated
      arrows
      class="q-my-lg full-width"
      control-color="black"
      transition-prev="scale"
      transition-next="scale"
      height="200px"
      :control-type="controlType"
    >
      <q-carousel-slide
        v-for="coffeeShop in coffeeShops"
        :key="coffeeShop.id"
        :name="coffeeShop.nombre"
        class="flex flex-center"
      >
        <div class="q-mt-md text-center">
          <h2>{{ coffeeShop.nombre }}</h2>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <div class="q-gutter-md column">
      <q-btn label="Consultar cafeterías" to="/coffeeShopList" type="a" />
      <q-btn label="Elegir" color="primary" @click="chooseCoffeeShop" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSelectedCoffeeShop } from "src/composables/useSelectedCoffeeShop";
import { useCoffeeShop } from "src/components/coffeeShop";

export default defineComponent({
  name: "ChooseCoffeeShopPage",

  setup() {
    const router = useRouter();
    const { setSelectedCoffeeShop } = useSelectedCoffeeShop(); // Usamos setSelectedCoffeeShop para guardar la selección
    const { coffeeShops, fetchCoffeeShops } = useCoffeeShop(); // Obtener las cafeterías de Firebase
    const currentCoffeeShop = ref(null); // Mantiene la cafetería seleccionada
    const isLoading = ref(true);

    // Llamar a la función para cargar las cafeterías cuando el componente se monte
    onMounted(() => {
      fetchCoffeeShops();
      // Evitar la carga del carousel hasta que esté listo
      isLoading.value = false;
    });

    const chooseCoffeeShop = () => {
      if (currentCoffeeShop.value) {
        setSelectedCoffeeShop(currentCoffeeShop.value);
        router.push({
          path: "/myBonuses",
          query: { coffeeShop: currentCoffeeShop.value },
        });
      }
    };

    return {
      controlType: ref("outline"),
      coffeeShops,
      currentCoffeeShop,
      chooseCoffeeShop,
      isLoading,
    };
  },
});
</script>
