<template>
  <div class="q-pa-md">
    <q-btn label="Enviar notificación" color="primary" />
    <q-table
      flat
      bordered
      title="Listado de Alumnos"
      :rows="rows"
      :columns="columns"
      row-key="Nombre"
      binary-state-sort
      virtual-scroll
      no-data-label="No hay alumnos disponibles"
      no-results-label="No hay alumnos disponibles para el filtro"
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
                @keyup.enter="
                  handleUpdate(props.row.DNI, 'Nombre', scope.value)
                "
                @blur="handleUpdate(props.row.DNI, 'Nombre', scope.value)"
                :rules="inputRules"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="Apellidos" :props="props">
            {{ props.row.Apellidos }}
            <q-popup-edit v-model="props.row.Apellidos" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="
                  handleUpdate(props.row.DNI, 'Apellidos', scope.value)
                "
                @blur="handleUpdate(props.row.DNI, 'Apellidos', scope.value)"
                :rules="inputRules"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="DNI" :props="props">
            {{ props.row.DNI }}
          </q-td>
          <q-td key="Telefono" :props="props">
            {{ props.row.Telefono }}
            <q-popup-edit v-model="props.row.Telefono" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="
                  handleUpdate(props.row.DNI, 'Telefono', scope.value)
                "
                @blur="handleUpdate(props.row.DNI, 'Telefono', scope.value)"
                :rules="phoneRules"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="Universidad" :props="props">
            {{ props.row.Universidad }}
            <q-popup-edit v-model="props.row.Universidad" v-slot="scope">
              <q-select
                v-model="scope.value"
                :options="universities"
                label="Seleccione una universidad"
                dense
                autofocus
                autosave
                @keyup.enter="
                  handleUpdate(props.row.Nombre, 'Universidad', scope.value)
                "
              />
            </q-popup-edit>
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn
              color="negative"
              icon="delete"
              round
              dense
              @click="handleDelete(props.row.DNI)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import {
  fetchStudents,
  updateStudent,
  deleteStudent,
} from "src/components/student";
import { fetchUniversities } from "src/components/university";
import { inputRules, phoneRules } from "src/composables/rules";

export default defineComponent({
  name: "AdminStudents",

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
        name: "Apellidos",
        required: true,
        label: "Apellidos",
        align: "left",
        field: (row) => row.Apellidos,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "DNI",
        required: true,
        label: "DNI",
        align: "left",
        field: (row) => row.DNI,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Telefono",
        required: true,
        label: "Telefono",
        align: "left",
        field: (row) => row.Telefono,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Universidad",
        required: true,
        label: "Universidad",
        align: "left",
        field: (row) => row.Universidad,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "delete",
        label: "Eliminar",
        align: "center",
        field: "delete",
      },
    ];

    const $q = useQuasar();
    const rows = ref([]);
    const universities = ref([]);

    // Cargar Alumnos
    const loadStudents = async () => {
      try {
        const studentsData = await fetchStudents();

        rows.value = studentsData;
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al cargar los alumnos: " + error,
        });
      }
    };

    // Actualizar Alumno
    const handleUpdate = async (dni, field, newValue) => {
      let rules;
      if (field === "Telefono") {
        rules = phoneRules;
      } else {
        rules = inputRules;
      }

      const isValid = rules.every((rule) => rule(newValue) === true);

      if (!isValid) {
        $q.notify({
          type: "negative",
          message:
            "El valor proporcionado no cumple con las reglas de validación",
        });
        return;
      }

      try {
        const updateData = { [field]: newValue };

        await updateStudent(dni, updateData);

        const updatedRow = rows.value.find((r) => r.DNI === dni);
        if (updatedRow) {
          updatedRow[field] = newValue;
        }

        $q.notify({
          type: "positive",
          message: `Alumno actualizado correctamente (${field}: ${newValue})`,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al actualizar alumno",
        });
      }
    };

    // Eliminar Alumno
    const handleDelete = async (dni) => {
      try {
        await deleteStudent(dni);
        rows.value = rows.value.filter((row) => row.DNI !== dni); // Elimina el alumno de la lista local
        $q.notify({
          type: "positive",
          message: "Alumno eliminado con éxito",
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al eliminar el alumno",
        });
      }
    };

    async function onMounted() {
      universities.value = await fetchUniversities();
      loadStudents();
    }

    onMounted();

    return {
      columns,
      rows,
      handleDelete,
      handleUpdate,
      universities,
      phoneRules,
      inputRules,
    };
  },
});
</script>
