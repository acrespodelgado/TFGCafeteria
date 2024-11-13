<template>
  <div class="q-pa-md">
    <q-btn
      label="Enviar notificación"
      color="primary"
      @click="sendNotification"
    />
    <q-table
      flat
      bordered
      title="Listado de Alumnos"
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
                @keyup.enter="handleUpdate(props.row.Nombre, scope.value)"
                @blur="handleUpdate(props.row.Nombre, scope.value)"
              />
            </q-popup-edit>
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
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";

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
        name: "delete",
        label: "Eliminar",
        align: "center",
        field: "delete",
      },
    ];

    const $q = useQuasar();
    const rows = ref([]);

    const loadStudents = async () => {
      try {
        const studentsData = await fetchStudents();

        rows.value = studentsData.map((student) => ({
          Nombre: student,
        }));
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al cargar los alumnos: " + error,
        });
      }
    };

    // Actualizar Alumno
    const handleUpdate = async (studentName, newStudentName) => {
      if (studentName !== newStudentName) {
        try {
          await updateStudent(studentName, newStudentName);
          rows.value = rows.value.map((r) =>
            r.Nombre === studentName ? { ...r, Nombre: newStudentName } : r
          );
          $q.notify({
            type: "positive",
            message: "Alumno " + studentName + " actualizado correctamente",
          });
        } catch (error) {
          $q.notify({
            type: "negative",
            message: "Error al actualizar alumno",
          });
        }
      }
    };

    // Eliminar Alumno
    const handleDelete = async (studentName) => {
      try {
        await deleteStudent(studentName);
        rows.value = rows.value.filter((row) => row.Nombre !== studentName); // Elimina el alumno de la lista local
        $q.notify({
          type: "positive",
          message: "Alumno " + studentName + " eliminado con éxito",
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al eliminar el alumno",
        });
      }
    };

    onMounted(() => {
      loadStudents();
    });

    return {
      columns,
      rows,
      newStudentName,
      handleDelete,
      handleUpdate,
    };
  },
});
</script>
