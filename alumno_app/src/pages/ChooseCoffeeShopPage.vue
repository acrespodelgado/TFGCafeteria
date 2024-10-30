<template>
  <q-page class="flex flex-center" v-if="!isLoading" id="chooseCoffeeShop">
    <div class="q-pa-xl text-center">
      <h1>Elige tu cafetería</h1>

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
          <div class="text-center">
            <img :alt="coffeeShop.Name" :src="coffeeShop.Url" width="200px" />
            <h2>
              {{ coffeeShop.Name }} - Universidad
              {{
                coffeeShop.University ? coffeeShop.University : "por definir"
              }}
            </h2>
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
      controlType: ref("outline"),
      coffeeShops,
      currentCoffeeShop,
      chooseCoffeeShop,
      isLoading,
    };
  },
});
</script>
