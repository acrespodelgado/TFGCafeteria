<template>
  <div class="q-pa-md">
    <q-btn label="Agregar Tipo de Bono" color="primary" @click="createBonus" />
    <q-table
      flat
      bordered
      title="Tipos de Bonus"
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
              @click="deleteBonus(props.row.Nombre)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="createDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nuevo Tipo de Bono</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newBonusName"
            label="Nombre del Bono"
            autofocus
            dense
            counter
          />
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancelar" @click="closeDialog" />
          <q-btn flat label="Agregar" color="primary" @click="addBonus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import {
  fetchBonusType,
  addBonusType,
  updateBonusType,
  deleteBonusType,
} from "src/components/bonus.js";
import { useQuasar } from "quasar";

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
        name: "delete",
        label: "Eliminar",
        align: "center",
        field: "delete",
      },
    ];

    const $q = useQuasar();
    const rows = ref([]);
    const createDialog = ref(false);
    const newBonusName = ref("");

    const loadBonuses = async () => {
      try {
        const bonusesData = await fetchBonusType();

        rows.value = bonusesData.map((bonus) => ({
          Nombre: bonus,
        }));
      } catch (error) {
        console.error("Error al cargar los tipos de Bonus:", error);
      }
    };

    const createBonus = () => {
      createDialog.value = true;
    };

    const closeDialog = () => {
      createDialog.value = false;
    };

    // Crear bono si no está vacío
    const addBonus = async () => {
      if (!newBonusName.value) {
        return;
      }

      try {
        await addBonusType(newBonusName.value);
        rows.value.push({ Nombre: newBonusName.value });
        $q.notify({
          type: "positive",
          message: "Bono " + newBonusName.value + " creado correctamente",
        });
        newBonusName.value = "";
        closeDialog();
      } catch (error) {
        $q.notify({ type: "negative", message: "Error al crear el bono" });
      }
    };

    // Actualizar bono
    const handleUpdate = async (bonusName, newBonusName) => {
      if (bonusName !== newBonusName) {
        try {
          await updateBonusType(bonusName, newBonusName);
          rows.value = rows.value.map((r) =>
            r.Nombre === bonusName ? { ...r, Nombre: newBonusName } : r
          );
          $q.notify({
            type: "positive",
            message: "Bono " + bonusName + " actualizado a " + newBonusName,
          });
        } catch (error) {
          $q.notify({
            type: "negative",
            message: "Error al actualizar el bono",
          });
        }
      }
    };

    // Eliminar bono
    const deleteBonus = async (bonusName) => {
      try {
        await deleteBonusType(bonusName);
        rows.value = rows.value.filter((row) => row.Nombre !== bonusName); // Elimina el bono de la lista local
        $q.notify({
          type: "positive",
          message: "Bono " + bonusName + " eliminado con éxito",
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al eliminar el bono",
        });
      }
    };

    onMounted(() => {
      loadBonuses();
    });

    return {
      columns,
      rows,
      createDialog,
      newBonusName,
      addBonus,
      createBonus,
      closeDialog,
      deleteBonus,
      handleUpdate,
    };
  },
});
</script>
