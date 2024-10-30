<template>
  <q-page v-if="!isLoading">
    <h1>Lugar a utilizar el tarjetero</h1>
    <h2 class="q-pt-none">Elige tu cafetería</h2>
    <div class="flex flex-center q-px-xl">
      <q-carousel
        v-model="currentCoffeeShop"
        vertical
        swipeable
        animated
        arrows
        class="q-my-lg full-width"
        control-color="secondary"
        transition-prev="scale"
        transition-next="scale"
        :control-type="controlType"
      >
        <q-carousel-slide
          v-for="coffeeShop in coffeeShops"
          :key="coffeeShop.id"
          :name="coffeeShop.Name"
          class="flex flex-center"
        >
          <div class="text-center circlePrimary">
            <img
              v-if="coffeeShop.Url"
              :alt="coffeeShop.Name"
              :src="coffeeShop.Url"
              width="100px"
            />
            <img
              v-else
              alt="CoffeeShop icon"
              src="../assets/local_cafe_48.png"
              width="100px"
            />
            <h3 class="q-my-xs">
              {{ coffeeShop.Name }}
            </h3>
            <h4 class="q-my-xs">
              Universidad
              {{
                coffeeShop.University ? coffeeShop.University : "por definir"
              }}
            </h4>
          </div>
        </q-carousel-slide>
      </q-carousel>

      <div class="q-gutter-md column">
        <q-btn
          label="Consultar cafeterías"
          to="/coffeeShopList"
          color="secondary"
          outline
          rounded
        />
        <q-btn
          label="Elegir"
          @click="chooseCoffeeShop"
          color="primary"
          rounded
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSelectedCoffeeShop } from "src/selected/useSelectedCoffeeShop";
import { useSelectedCompany } from "src/selected/useSelectedCompany";
import { useCoffeeShop } from "src/components/coffeeShop";
import { getCompanyByCoffeeShop } from "src/components/company";

export default defineComponent({
  name: "ChooseCoffeeShopPage",

  setup() {
    const router = useRouter();
    const { setSelectedCoffeeShop } = useSelectedCoffeeShop();
    const { setSelectedCompany } = useSelectedCompany();
    const { coffeeShops, fetchCoffeeShops } = useCoffeeShop(); // Obtener las cafeterías de Firebase
    const currentCoffeeShop = ref(null); // Mantiene la cafetería seleccionada
    const isLoading = ref(true);

    // Llamar a la función para cargar las cafeterías cuando el componente se monte
    onMounted(async () => {
      await fetchCoffeeShops();
      // Evitar la carga del carousel hasta que esté listo
      isLoading.value = false;

      // Inicializar currentCoffeeShop con la primera cafetería
      if (coffeeShops.value && coffeeShops.value.length > 0) {
        currentCoffeeShop.value = coffeeShops.value[0].Name;
      }
    });

    const chooseCoffeeShop = async () => {
      if (currentCoffeeShop.value) {
        setSelectedCoffeeShop(currentCoffeeShop.value);
        const selectedCompany = await getCompanyByCoffeeShop(
          currentCoffeeShop.value
        );
        setSelectedCompany(selectedCompany);
        router.push("/myBonuses");
      }
    };

    return {
      controlType: ref("regular"),
      coffeeShops,
      currentCoffeeShop,
      chooseCoffeeShop,
      isLoading,
    };
  },
});
</script>
