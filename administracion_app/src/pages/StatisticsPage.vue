<template>
  <h1>Consulta estadísticas generales de nuestras cafeterías</h1>
  <h2 class="q-pt-none">Listado de Métricas</h2>
  <q-page>
    <div class="q-pa-sm text-center">
      <q-input
        filled
        v-model="startDate"
        label="Fecha de inicio"
        type="date"
        mask="date"
        @input="filterData"
      />
      <q-input
        filled
        v-model="endDate"
        label="Fecha de fin"
        type="date"
        mask="date"
        @input="filterData"
      />
    </div>

    <q-table
      :rows="filteredSells"
      :columns="columns"
      row-key="id"
      title="Ventas"
      :filter="filter"
      :rows-per-page-options="[5, 10, 15]"
      :sort-method="sortMethod"
      :sort-by="['Fecha']"
    />

    <q-table
      :rows="filteredRecharges"
      :columns="columns"
      row-key="id"
      title="Recargas"
      :filter="filter"
      :rows-per-page-options="[5, 10, 15]"
      :sort-method="sortMethod"
      :sort-by="['Fecha']"
    />

    <BackButton />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { fetchSells, fetchRecharges } from "src/components/transaction";
import BackButton from "src/layouts/BackButton.vue";

export default defineComponent({
  name: "StatisticsPage",
  components: {
    BackButton,
  },
  setup() {
    const startDate = ref("");
    const endDate = ref("");
    const filter = ref("");
    const sells = ref([]);
    const recharges = ref([]);
    const filteredSells = ref([]);
    const filteredRecharges = ref([]);
    const columns = [
      {
        name: "Camarero",
        required: true,
        label: "Camarero",
        align: "left",
        field: "Camarero",
        sortable: true,
      },
      {
        name: "Fecha",
        required: true,
        label: "Fecha",
        align: "left",
        field: "Fecha",
        sortable: true,
      },
      {
        name: "Alumno",
        required: true,
        label: "Alumno",
        align: "left",
        field: "Alumno",
        sortable: true,
      },
      {
        name: "Cafeteria",
        required: true,
        label: "Cafetería",
        align: "left",
        field: "Cafeteria",
        sortable: true,
      },
      {
        name: "Tipo_Bono",
        required: true,
        label: "Tipo de Bono",
        align: "left",
        field: "Tipo_Bono",
        sortable: true,
      },
    ];

    // Cargar las transacciones de Ventas y Recargas
    const loadTransactions = async () => {
      try {
        sells.value = await fetchSells();
        recharges.value = await fetchRecharges();
        filterData();
      } catch (error) {
        console.error("Error al cargar las transacciones:", error);
      }
    };

    // Filtrar las transacciones por fecha
    const filterData = () => {
      let start = new Date(startDate.value);
      let end = new Date(endDate.value);

      // Filtrar Ventas
      filteredSells.value = sells.value.filter((sell) => {
        const sellDate = new Date(sell.Fecha.seconds * 1000);
        return (
          (!startDate.value || sellDate >= start) &&
          (!endDate.value || sellDate <= end)
        );
      });

      // Filtrar Recargas
      filteredRecharge.value = recharges.value.filter((recharge) => {
        const rechargeDate = new Date(recharge.Fecha.seconds * 1000);
        return (
          (!startDate.value || rechargeDate >= start) &&
          (!endDate.value || rechargeDate <= end)
        );
      });
    };

    onMounted(() => {
      loadTransactions();
    });

    return {
      columns,
      filteredSells,
      filteredRecharges,
      startDate,
      endDate,
      filter,
      filterData,
    };
  },
});
</script>
