<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md text-center coffeeShopList">
      <h1>Listado de Cafeterías</h1>
      <div
        v-for="(coffeeShops, company) in groupedCoffeeShops"
        :key="company"
        class="tableContainer"
      >
        <q-table
          class="q-mb-lg"
          :dense="$q.screen.lt.sm"
          :title="company"
          :rows="coffeeShops"
          :columns="[
            { name: 'name', label: 'Nombre', align: 'left', field: 'Name' },
            {
              name: 'university',
              label: 'Universidad',
              align: 'left',
              field: 'University',
              format: (val) => val || 'No disponible', // Valor por defecto
            },
            {
              name: 'phone',
              label: 'Teléfono',
              align: 'left',
              field: 'Phone',
              format: (val) => val || 'No disponible', // Valor por defecto
            },
            {
              name: 'schedule',
              label: 'Horario',
              align: 'left',
              field: 'Schedule',
              format: (val) => val || 'Por definir', // Valor por defecto
            },
            { name: 'menu', label: 'Menú', align: 'left', field: 'Menu' },
          ]"
          row-key="value"
          flat
          bordered
          separator="vertical"
          hide-bottom
          virtual-scroll
        >
          <template v-slot:body-cell-menu="props">
            <q-td :props="props">
              <span v-if="props.row.Menu">
                <q-btn
                  flat
                  :href="props.row.Menu"
                  target="_blank"
                  rel="noopener"
                  label="Ver menú"
                />
              </span>
              <span v-else>Por definir</span>
            </q-td>
          </template>
        </q-table>
      </div>
      <q-btn
        label="Elegir cafetería"
        to="/chooseCoffeeShop"
        color="primary"
        rounded
      />
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
