<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <h1>Listado de Cafeterías</h1>
      <div v-for="(coffeeShops, empresa) in groupedCoffeeShops" :key="empresa">
        <q-table
          class="q-mb-lg"
          :dense="$q.screen.lt.md"
          :title="empresa"
          :rows="coffeeShops"
          :columns="[
            { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
            {
              name: 'universidad',
              label: 'Universidad',
              align: 'left',
              field: 'universidad',
              format: (val) => val || 'No disponible', // Valor por defecto
            },
            {
              name: 'telefono',
              label: 'Teléfono',
              align: 'left',
              field: 'telefono',
              format: (val) => val || 'No disponible', // Valor por defecto
            },
            {
              name: 'horario',
              label: 'Horario',
              align: 'left',
              field: 'horario',
              format: (val) => val || 'Por definir', // Valor por defecto
            },
          ]"
          row-key="value"
          flat
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
