<template>
  <div class="q-pa-md">
    <q-btn label="Agregar Camarero" color="primary" @click="createWorker" />
    <q-table
      flat
      bordered
      title="Camareros"
      :rows="rows"
      :columns="columns"
      row-key="DNI"
      binary-state-sort
      hide-pagination
      virtual-scroll
      no-data-label="No hay camareros disponibles"
      no-results-label="No hay camareros disponibles para el filtro"
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
                @keyup.enter="
                  handleUpdate(props.row.DNI, 'Nombre', scope.value)
                "
                @blur="handleUpdate(props.row.DNI, 'Nombre', scope.value)"
                :rules="inputRules"
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
              v-slot="scope"
            >
              <q-input
                type="number"
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

    <q-dialog v-model="createDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nuevo Camarero</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newWorkerName"
            label="Nombre"
            autofocus
            dense
            :rules="inputRules"
          />
          <q-input
            v-model="newWorkerDNI"
            label="DNI"
            autofocus
            dense
            :rules="dniRules"
          />
          <q-input
            v-model="newWorkerPhone"
            label="Teléfono"
            autofocus
            dense
            type="number"
            :rules="phoneRules"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancelar" @click="closeDialog" />
          <q-btn flat label="Agregar" color="primary" @click="handleAdd" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import {
  fetchWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
} from "src/components/workers.js";
import { phoneRules, dniRules, inputRules } from "src/composables/rules";
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
      {
        name: "delete",
        label: "Eliminar",
        align: "center",
        field: "delete",
      },
    ];

    const $q = useQuasar();
    const data = ref();
    const rows = ref([]);
    const createDialog = ref(false);
    const newWorkerName = ref("");
    const newWorkerDNI = ref("");
    const newWorkerPhone = ref("");

    const createWorker = () => {
      createDialog.value = true;
    };

    const closeDialog = () => {
      createDialog.value = false;
    };

    // Cargar camareros
    const loadWorkers = async () => {
      try {
        const workersData = await fetchWorkers(data.value.Nombre);

        if (workersData) {
          rows.value = workersData;
        }
      } catch (error) {
        console.error("Error al cargar los camareros:", error);
      }
    };

    async function onMounted() {
      data.value = await getCurrentUserData();
      loadWorkers();
    }

    onMounted();

    // Crear nuevo camarero
    const handleAdd = async () => {
      if (
        !newWorkerName.value ||
        !newWorkerDNI.value ||
        !newWorkerPhone.value
      ) {
        $q.notify({
          type: "negative",
          message: "Rellene los campos obligatorios",
        });
        return;
      }

      // Validar teléfono y dni
      const phoneIsValid = phoneRules.every(
        (rule) => rule(newWorkerPhone.value) === true
      );
      const dniIsValid = dniRules.every(
        (rule) => rule(newWorkerDNI.value) === true
      );

      if (!phoneIsValid) {
        $q.notify({
          type: "negative",
          message: "El teléfono no cumple con las reglas de validación",
        });
        return;
      }

      if (!dniIsValid) {
        $q.notify({
          type: "negative",
          message: "El DNI no cumple con las reglas de validación",
        });
        return;
      }

      try {
        await addWorker(
          newWorkerName.value,
          newWorkerDNI.value,
          newWorkerPhone.value,
          data.value.Nombre
        );
        rows.value.push({
          Nombre: newWorkerName.value,
          DNI: newWorkerDNI.value,
          Telefono: newWorkerPhone.value,
        });

        $q.notify({
          type: "positive",
          message: "Camarero " + newWorkerName.value + " creado correctamente",
        });

        newWorkerName.value = "";
        newWorkerDNI.value = "";
        newWorkerPhone.value = "";
        closeDialog();
      } catch (error) {
        $q.notify({ type: "negative", message: "Error al crear el camarero" });
      }
    };

    // Actualizar camarero
    const handleUpdate = async (dni, field, newValue) => {
      let rules;
      if (field === "Telefono") {
        rules = phoneRules;
      } else {
        rules = inputRules;
      }

      // Verificar si el valor cumple con las reglas de validación
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
        const updatedData = { [field]: newValue };
        await updateWorker(dni, updatedData);

        // Actualizar la fila localmente
        rows.value = rows.value.map((r) =>
          r.DNI === dni ? { ...r, [field]: newValue } : r
        );

        $q.notify({
          type: "positive",
          message: `Camarero ${dni} actualizado correctamente`,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al actualizar el camarero",
        });
      }
    };

    // Eliminar camarero
    const handleDelete = async (dni) => {
      try {
        await deleteWorker(dni);
        rows.value = rows.value.filter((row) => row.DNI !== dni); // Elimina el camarero de la lista local
        $q.notify({
          type: "positive",
          message: "Camarero eliminado con éxito",
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al eliminar el camarero",
        });
      }
    };

    return {
      columns,
      rows,
      phoneRules,
      inputRules,
      dniRules,
      createWorker,
      createDialog,
      newWorkerName,
      newWorkerDNI,
      newWorkerPhone,
      handleAdd,
      closeDialog,
      handleDelete,
      handleUpdate,
    };
  },
});
</script>
