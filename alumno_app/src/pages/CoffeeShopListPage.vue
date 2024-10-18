<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <h1>Listado de Cafeterías</h1>
      <div v-for="(coffeeShops, empresa) in groupedCoffeeShops" :key="empresa">
        <h2>{{ empresa }}</h2>

        <q-table
          :rows="coffeeShops"
          :columns="[
            { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
            {
              name: 'universidad',
              label: 'Universidad',
              align: 'left',
              field: 'universidad',
            },
            {
              name: 'telefono',
              label: 'Teléfono',
              align: 'left',
              field: 'telefono',
            },
            {
              name: 'horario',
              label: 'Horario',
              align: 'left',
              field: 'horario',
            },
          ]"
          row-key="value"
          bordered
          hide-bottom
          virtual-scroll
        />
      </div>
    </div>
    <BackButton />
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useCoffeeShop } from "src/components/coffeeShop";
import BackButton from "src/layouts/BackButton.vue";

export default defineComponent({
  name: "CoffeeShopListPage",
  components: {
    BackButton,
  },

  setup() {
    const { groupedCoffeeShops, fetchCoffeeShops } = useCoffeeShop();

    onMounted(() => {
      fetchCoffeeShops();
    });

    return {
      groupedCoffeeShops,
    };
  },
});
</script>
