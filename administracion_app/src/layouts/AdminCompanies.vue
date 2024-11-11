<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Gestión de Empresas"
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
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn
              color="negative"
              icon="delete"
              round
              dense
              @click="handleDelete(props.row.Nombre)"
            />
          </q-td>
          <q-td key="validate" :props="props">
            <q-btn
              v-if="!props.row.Validate"
              color="positive"
              icon="check"
              round
              dense
              @click="handleValidate(props.row.Nombre)"
            />
            <label v-else>Validado</label>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import {
  fetchCompanies,
  deleteCompany,
  validateCompany,
} from "src/components/company";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "AdminCompanies",

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
        name: "delete",
        label: "Eliminar",
        align: "center",
        field: "delete",
      },
      {
        name: "validate",
        label: "Validar",
        align: "center",
        field: "validate",
      },
    ];

    const $q = useQuasar();
    const rows = ref([]);

    const loadCompanies = async () => {
      try {
        const companiesData = await fetchCompanies();

        rows.value = companiesData.map((company) => ({
          Nombre: company.Nombre,
          Validate: company.Validate === true,
        }));
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al cargar las empresas",
        });
      }
    };

    const handleDelete = async (companyName) => {
      try {
        await deleteCompany(companyName);
        rows.value = rows.value.filter((row) => row.Nombre !== companyName); // Elimina la empresa de la lista local
        $q.notify({
          type: "positive",
          message: "Empresa " + companyName + " eliminada con éxito",
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al eliminar la empresa",
        });
      }
    };

    const handleValidate = async (companyName) => {
      try {
        await validateCompany(companyName);

        // Actualizar el estado local para que la tabla se actualice
        const companyIndex = rows.value.findIndex(
          (row) => row.Nombre === companyName
        );
        if (companyIndex !== -1) {
          rows.value[companyIndex].Validate = true;
        }

        $q.notify({
          type: "positive",
          message: "Empresa " + companyName + " validada con éxito",
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al validar la empresa",
        });
      }
    };

    onMounted(() => {
      loadCompanies();
    });

    return {
      columns,
      rows,
      handleDelete,
      handleValidate,
    };
  },
});
</script>
