<template>
  <q-page>
    <h1>Consulta los usos y recargas de todos tus bonos</h1>
    <h2 class="q-pt-none">Mis transacciones</h2>
    <div class="q-pa-md">
      <div v-if="transactions.length > 0">
        <q-table
          class="transactionsTable"
          :dense="$q.screen.lt.xs"
          :rows="transactions"
          :columns="columns"
          row-key="id"
          flat
          virtual-scroll
        >
          <template v-slot:body-cell-tipo_transaccion="props">
            <q-td :props="props">
              <q-icon :name="props.row.icon" :icon="props.row.icon" />
              {{ props.row.Tipo }}
            </q-td>
          </template>

          <template v-slot:body-cell-tipo_bono="props">
            <q-td :props="props">
              {{ props.row.Tipo_Bono }}
            </q-td>
          </template>

          <template v-slot:body-cell-cafeteria="props">
            <q-td :props="props">
              {{ props.row.Cafeteria }}
            </q-td>
          </template>

          <template v-slot:body-cell-fecha="props">
            <q-td :props="props">
              {{ formatDate(props.row.Fecha) }}
            </q-td>
          </template>
        </q-table>
      </div>
      <div v-else class="flex flex-center q-my-xl">
        <div class="circlePrimary">
          <h3 class="text-center">No existen transacciones disponibles</h3>
        </div>
      </div>
    </div>
    <BackButton />
  </q-page>
</template>

<script>
import { useQuasar, date } from "quasar";
import { defineComponent, onMounted, ref } from "vue";
import { fetchTransaction } from "src/components/transactions";
import BackButton from "src/layouts/BackButton.vue";

export default defineComponent({
  name: "MyTransactionsPage",
  components: {
    BackButton,
  },

  setup() {
    const $q = useQuasar();
    const transactions = ref([]);

    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await fetchTransaction(); // Obtener las transacciones de Firebase
        transactions.value = fetchedTransactions.map((transaction) => ({
          id: transaction.id,
          icon:
            transaction.Tipo === "Venta" ? "do_not_disturb_on" : "add_circle",
          Tipo: transaction.Tipo,
          Tipo_Bono: transaction.Tipo_Bono,
          Cafeteria: transaction.Cafeteria,
          Fecha: transaction.Fecha,
        }));
      } catch (error) {
        $q.notify({
          icon: "error",
          color: "negative",
          message: error.message,
        });
      }
    };

    // Función para formatear la fecha
    const formatDate = (value) => {
      if (value && typeof value.toDate === "function") {
        value = value.toDate();
      }

      if (value instanceof Date) {
        return date.formatDate(value, "DD/MM/YYYY HH:mm");
      } else {
        return "Fecha no disponible";
      }
    };

    onMounted(() => {
      fetchTransactions();
    });

    return {
      transactions,
      formatDate,
      columns: [
        {
          name: "tipo_transaccion",
          label: "Tipo de Transacción",
          field: "Tipo",
          align: "left",
          sortable: true,
        },
        {
          name: "tipo_bono",
          label: "Tipo de Bono",
          field: "Tipo_Bono",
          align: "left",
          sortable: true,
        },
        {
          name: "cafeteria",
          label: "Cafetería",
          field: "Cafeteria",
          align: "left",
          sortable: true,
        },
        {
          name: "fecha",
          label: "Fecha",
          field: "Fecha",
          align: "right",
          sortable: true,
        },
      ],
    };
  },
});
</script>
