<template>
  <h1>Consulta estadísticas generales de nuestras cafeterías</h1>
  <h2 class="q-pt-none">Listado de Métricas</h2>
  <q-page class="q-pa-xl column">
    <div class="text-center flex flex-inline">
      <!-- Filtros -->
      <q-input
        class="q-mr-md"
        filled
        v-model="startDate"
        label="Fecha de inicio"
        type="date"
        mask="date"
        @update:model-value="filterData"
      />
      <q-input
        class="q-mr-md"
        filled
        v-model="endDate"
        label="Fecha de fin"
        type="date"
        mask="date"
        @update:model-value="filterData"
      />
      <q-select
        style="min-width: 200px"
        class="q-mr-md"
        filled
        v-model="selectedWorker"
        :options="workerOptions"
        label="Filtrar por camarero"
        emit-value
        map-options
        @update:model-value="filterData"
      />
    </div>

    <q-btn
      label="Exportar Ventas a CSV"
      color="secondary"
      class="q-mt-md"
      @click="exportToCSV(filteredSells, 'ventas.csv')"
    />
    <!-- Tabla de Ventas -->
    <q-table
      :rows="filteredSells"
      :columns="columns"
      row-key="id"
      title="Ventas"
      :filter="filter"
      :rows-per-page-options="[5, 10, 15]"
      :sort-method="
        (rows, sortBy, descending) =>
          rows.sort((a, b) => sortMethod(a, b, sortBy, descending))
      "
      :sort-by="['Fecha']"
      no-data-label="No hay resultados para ventas"
      no-results-label="No hay resultados de ventas para el filtro"
    >
      <template v-slot:bottom-row>
        <q-tr>
          <q-td colspan="4">
            <strong>Total de Ventas</strong>
          </q-td>
          <q-td>
            <strong>{{ totalSells }}</strong>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-btn
      label="Exportar Recargas a CSV"
      color="secondary"
      class="q-mt-md"
      @click="exportToCSV(filteredRecharges, 'recargas.csv')"
    />

    <!-- Tabla de Recargas -->
    <q-table
      :rows="filteredRecharges"
      :columns="columns"
      row-key="id"
      title="Recargas"
      :filter="filter"
      :rows-per-page-options="[5, 10, 15]"
      :sort-method="
        (rows, sortBy, descending) =>
          rows.sort((a, b) => sortMethod(a, b, sortBy, descending))
      "
      :sort-by="['Fecha']"
      no-data-label="No hay resultados para recargas"
      no-results-label="No hay resultados de recargas para el filtro"
    >
      <template v-slot:bottom-row>
        <q-tr>
          <q-td colspan="4">
            <strong>Total de Recargas</strong>
          </q-td>
          <q-td>
            <strong>{{ totalRecharges }}</strong>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <BackButton />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { fetchSells, fetchRecharges } from "src/components/transaction";
import { useQuasar } from "quasar";
import { getAuth } from "firebase/auth";
import BackButton from "src/layouts/BackButton.vue";

export default defineComponent({
  name: "StatisticsPage",
  components: {
    BackButton,
  },
  setup() {
    const $q = useQuasar();
    const startDate = ref("");
    const endDate = ref("");
    const selectedWorker = ref(null); // Filtro seleccionado
    const filter = ref("");
    const sells = ref([]);
    const recharges = ref([]);
    const filteredSells = ref([]);
    const filteredRecharges = ref([]);
    const totalSells = ref(0);
    const totalRecharges = ref(0);
    const workerOptions = ref([]);

    // Columnas de las tablas
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
        format: (val) => {
          return new Date(val.seconds * 1000).toLocaleDateString();
        },
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

    const loadTransactions = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        const sellsData = (await fetchSells(user.uid)) || [];
        const rechargesData = (await fetchRecharges(user.uid)) || [];

        sells.value = Array.isArray(sellsData) ? sellsData : [];
        recharges.value = Array.isArray(rechargesData) ? rechargesData : [];

        updateWorkerOptions();
        filterData();
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al cargar las transacciones: " + error,
        });

        sells.value = [];
        recharges.value = [];
      }
    };
    const filterData = () => {
      let start = startDate.value ? new Date(startDate.value) : null;
      let end = endDate.value ? new Date(endDate.value) : null;

      if (end) {
        end.setHours(23, 59, 59, 999);
      }

      // Validar que sells.value sea un array antes de filtrar
      filteredSells.value = Array.isArray(sells.value)
        ? sells.value.filter((sell) => {
            const sellDate = new Date(sell.Fecha.seconds * 1000);
            return (
              (!start || sellDate >= start) &&
              (!end || sellDate <= end) &&
              (!selectedWorker.value || sell.Camarero === selectedWorker.value)
            );
          })
        : [];

      totalSells.value = filteredSells.value.length;

      // Validar que recharges.value sea un array antes de filtrar
      filteredRecharges.value = Array.isArray(recharges.value)
        ? recharges.value.filter((recharge) => {
            const rechargeDate = new Date(recharge.Fecha.seconds * 1000);
            return (
              (!start || rechargeDate >= start) &&
              (!end || rechargeDate <= end) &&
              (!selectedWorker.value ||
                recharge.Camarero === selectedWorker.value)
            );
          })
        : [];

      totalRecharges.value = filteredRecharges.value.length;
    };

    const sortMethod = (a, b, sortBy) => {
      if (!sortBy) return 0; // Si sortBy es null, no hacer nada

      if (sortBy === "Fecha") {
        const dateA = a.Fecha?.seconds
          ? new Date(a.Fecha.seconds * 1000)
          : new Date(0);
        const dateB = b.Fecha?.seconds
          ? new Date(b.Fecha.seconds * 1000)
          : new Date(0);
        return dateA - dateB;
      }

      const valueA = a[sortBy] || "";
      const valueB = b[sortBy] || "";

      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    };

    const updateWorkerOptions = () => {
      const allWorkers = new Set(); // Usamos Set para evitar duplicados

      // Añadir camareros de las ventas
      sells.value.forEach((sell) => {
        allWorkers.add(sell.Camarero);
      });

      // Añadir camareros de las recargas
      recharges.value.forEach((recharge) => {
        allWorkers.add(recharge.Camarero);
      });

      workerOptions.value = [
        { label: "Todos los camareros", value: null }, // Opción para todos los camareros
        ...Array.from(allWorkers).map((worker) => ({
          label: worker,
          value: worker,
        })),
      ];
    };

    // Función para exportar a CSV
    const exportToCSV = (data, filename) => {
      if (!data || !data.length) {
        $q.notify({
          type: "negative",
          message: "No hay datos para exportar",
        });
        return;
      }

      // Crear los encabezados basados en las columnas
      const headers = columns.map((col) => col.label);

      // Convertir los datos a formato CSV
      const rows = data.map((item) => {
        return columns.map((col) => {
          const field = col.field;
          return item[field] !== undefined ? item[field] : "";
        });
      });

      // Unir encabezados y filas
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Crear un enlace para descargar el CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    onMounted(() => {
      loadTransactions();
    });

    return {
      columns,
      filter,
      filteredSells,
      filteredRecharges,
      totalSells,
      totalRecharges,
      startDate,
      endDate,
      selectedWorker,
      workerOptions,
      filterData,
      sortMethod,
      exportToCSV,
    };
  },
});
</script>
