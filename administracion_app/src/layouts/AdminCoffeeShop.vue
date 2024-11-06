<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Cafeterias"
      :rows="rows"
      :columns="columns"
      row-key="Nombre"
      binary-state-sort
      hide-bottom
      virtual-scroll
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="Nombre" :props="props">
            {{ props.row.Nombre }}
            <q-popup-edit v-model="props.row.Nombre" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="Horario" :props="props">
            {{ props.row.Horario }}
            <q-popup-edit v-model="props.row.Horario" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="Telefono" :props="props">
            {{ props.row.Telefono }}
            <q-popup-edit
              v-model="props.row.Telefono"
              title="Actualizar teléfono"
              buttons
              v-slot="scope"
            >
              <q-input type="number" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="Menu" :props="props">
            {{ props.row.Menu }}
            <q-popup-edit v-model="props.row.Menu" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="Universidad" :props="props">
            {{ props.row.Universidad }}
            <q-popup-edit v-model="props.row.Universidad" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="Pin" :props="props">
            {{ props.row.Pin }}
            <q-popup-edit
              v-model="props.row.Pin"
              title="Actualizar pin acceso"
              buttons
              v-slot="scope"
            >
              <q-input type="number" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="Url_Logo" :props="props">
            {{ props.row.Url_Logo }}
            <q-popup-edit v-model="props.row.Url_Logo" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { getCurrentUserData } from "src/composables/firebaseAuth";
import { fetchCoffeeShopsByCompany } from "src/components/coffeeShop";

export default defineComponent({
  name: "AdminCoffeeShop",

  setup() {
    const columns = [
      {
        name: "Nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.Nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Horario",
        align: "center",
        label: "Horario",
        field: "Horario",
        sortable: true,
      },
      {
        name: "Telefono",
        align: "center",
        label: "Telefono",
        field: "Telefono",
        sortable: true,
      },
      {
        name: "Menu",
        align: "center",
        label: "Menú",
        field: "Menu",
        sortable: false,
      },
      {
        name: "Universidad",
        align: "center",
        label: "Universidad",
        field: "Universidad",
        sortable: true,
      },
      {
        name: "Pin",
        align: "center",
        label: "Pin",
        field: "Pin",
        sortable: true,
      },
      {
        name: "Url_Logo",
        label: "Url Logo",
        field: "Url_Logo",
        sortable: false,
      },
    ];

    const rows = ref([]);

    const loadCoffeeShops = async () => {
      try {
        const data = await getCurrentUserData();
        const coffeeShopData = await fetchCoffeeShopsByCompany(data.Nombre);

        if (coffeeShopData) {
          rows.value = coffeeShopData;
        }
      } catch (error) {
        console.error("Error al cargar las cafeterias:", error);
      }
    };

    onMounted(() => {
      loadCoffeeShops();
    });

    return { columns, rows };
  },
});
</script>
