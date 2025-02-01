<template>
  <q-page>
    <h1>Consulta datos generales de nuestras cafeterías</h1>
    <h2 class="q-pt-none">Listado de Cafeterías</h2>
    <!-- Mostrar mensaje si no hay cafeterías -->

    <div
      v-if="Object.keys(groupedCoffeeShops).length === 0"
      class="flex flex-center"
    >
      <div class="text-center circlePrimary q-my-lg">
        <h3 class="q-my-xs">No hay cafeterías disponibles.</h3>
      </div>
    </div>

    <!-- Mostrar las tablas solo si hay cafeterías -->
    <div v-else class="q-pa-sm text-center coffeeShopList">
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
            {
              name: 'name',
              label: 'Nombre',
              align: 'left',
              field: 'Name',
              sortable: true,
            },
            {
              name: 'university',
              label: 'Universidad',
              align: 'left',
              field: 'University',
              format: (val) => val || 'No disponible', // Valor por defecto
              sortable: true,
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
            {
              name: 'menu',
              label: 'Menú',
              align: 'left',
              field: 'Menu',
            },
          ]"
          row-key="value"
          flat
          bordered
          separator="vertical"
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
              <span v-else
                ><q-btn target="_blank" href="https://bit.ly/MenuSaludableUCA"
                  >VER MENÚ</q-btn
                >
              </span>
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
