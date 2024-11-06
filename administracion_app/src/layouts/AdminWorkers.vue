<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Camareros"
      :rows="rows"
      :columns="columns"
      row-key="DNI"
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
          <q-td key="DNI" :props="props">
            {{ props.row.DNI }}
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
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { fetchWorkers } from "src/components/workers.js";
import { getCurrentUserData } from "src/composables/firebaseAuth";

export default defineComponent({
  name: "AdminWorkers",

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
        name: "DNI",
        align: "center",
        label: "DNI",
        field: "DNI",
        sortable: true,
      },
      {
        name: "Telefono",
        label: "Teléfono",
        field: "Telefono",
        sortable: true,
      },
    ];

    const rows = ref([]);

    const loadWorkers = async () => {
      try {
        const data = await getCurrentUserData();
        const workersData = await fetchWorkers(data.Nombre);

        if (workersData) {
          rows.value = workersData;
        }
      } catch (error) {
        console.error("Error al cargar los camareros:", error);
      }
    };

    onMounted(() => {
      loadWorkers();
    });

    return { columns, rows };
  },
});
</script>
