<template>
  <div class="q-pa-md column">
    <q-btn
      @click="createCoffeeShopDialog"
      color="secondary"
      label="Añadir Cafetería"
      class="q-pa-sm"
    />
    <q-table
      flat
      bordered
      title="Cafeterias"
      :rows="rows"
      :columns="columns"
      row-key="Nombre"
      binary-state-sort
      virtual-scroll
      no-data-label="No hay cafeterías disponibles"
      no-results-label="No hay cafeterías disponibles para el filtro"
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
                  handleUpdate(props.row.Nombre, 'Nombre', scope.value)
                "
                @blur="handleUpdate(props.row.Nombre, 'Nombre', scope.value)"
                :rules="inputRules"
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
                @keyup.enter="
                  handleUpdate(props.row.Nombre, 'Horario', scope.value)
                "
                @blur="handleUpdate(props.row.Nombre, 'Horario', scope.value)"
                :rules="inputRules"
              />
            </q-popup-edit>
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
                  handleUpdate(props.row.Nombre, 'Telefono', scope.value)
                "
                @blur="handleUpdate(props.row.Nombre, 'Telefono', scope.value)"
                :rules="phoneRules"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="Menu" :props="props">
            {{ props.row.Menu ? props.row.Menu : "Por definir" }}
            <q-popup-edit v-model="props.row.Menu" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="
                  handleUpdate(props.row.Nombre, 'Menu', scope.value)
                "
                @blur="handleUpdate(props.row.Nombre, 'Menu', scope.value)"
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
          <q-td key="Pin" :props="props">
            {{ props.row.Pin }}
            <q-popup-edit
              v-model="props.row.Pin"
              title="Actualizar pin acceso"
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="
                  handleUpdate(props.row.Nombre, 'Pin', scope.value)
                "
                @blur="handleUpdate(props.row.Nombre, 'Pin', scope.value)"
                :rules="pinRules"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="Url_Logo" :props="props">
            {{ props.row.Url_Logo ? props.row.Menu : "Por definir" }}
            <q-popup-edit v-model="props.row.Url_Logo" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="
                  handleUpdate(props.row.Nombre, 'Url_Logo', scope.value)
                "
                @blur="handleUpdate(props.row.Nombre, 'Url_Logo', scope.value)"
              />
            </q-popup-edit>
          </q-td>
          <q-td>
            <q-btn
              @click="handleDelete(props.row.Nombre)"
              color="negative"
              icon="delete"
              round
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Dialogo para añadir nueva cafetería -->
    <q-dialog v-model="createCoffeeShop">
      <q-card>
        <q-card-section>
          <div class="text-h6">Añadir Nueva Cafetería</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newCoffeeShop.Nombre"
            label="Nombre"
            :rules="inputRules"
          />
          <q-input
            v-model="newCoffeeShop.Horario"
            label="Horario"
            :rules="inputRules"
            placeholder="9:00 a 18:00"
          />
          <q-input
            v-model="newCoffeeShop.Telefono"
            label="Telefono"
            :rules="phoneRules"
            type="number"
          />
          <q-input v-model="newCoffeeShop.Menu" label="Menu" />
          <q-select
            v-model="newCoffeeShop.Universidad"
            :options="universities"
            label="Seleccione una universidad"
            placeholder="Url del pdf"
          />
          <q-input
            v-model="newCoffeeShop.Pin"
            label="Pin"
            :rules="pinRules"
            type="number"
            placeholder="9999"
          />
          <q-input v-model="newCoffeeShop.Url_Logo" label="Url Logo" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="closeDialog" />
          <q-btn flat label="Añadir" color="primary" @click="handleAdd" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { getCurrentUserData } from "src/composables/firebaseAuth";
import {
  fetchCoffeeShopsByCompany,
  updateCoffeeShop,
  addCoffeeShop,
  deleteCoffeeShop,
} from "src/components/coffeeShop";
import { fetchUniversities } from "src/components/university";
import { phoneRules, inputRules, pinRules } from "src/composables/rules";

export default defineComponent({
  name: "AdminCoffeeShop",

  setup() {
    const $q = useQuasar();
    const columns = [
      {
        name: "Nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.Nombre,
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
      { name: "Acciones", label: "Acciones", field: "acciones" },
    ];

    const rows = ref([]);
    const data = ref();
    const newCoffeeShop = ref({
      Nombre: "",
      Horario: "",
      Telefono: "",
      Menu: "",
      Universidad: "",
      Pin: "",
      Url_Logo: "",
    });

    const universities = ref([]);
    const createCoffeeShop = ref(false);

    const createCoffeeShopDialog = () => {
      createCoffeeShop.value = true;
    };

    const closeDialog = () => {
      createCoffeeShop.value = false;
    };

    const loadCoffeeShops = async () => {
      try {
        const coffeeShopData = await fetchCoffeeShopsByCompany(
          data.value.Nombre
        );
        if (coffeeShopData) {
          rows.value = coffeeShopData;
        }
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al cargar las cafeterias: " + error,
        });
      }
    };

    async function onMounted() {
      data.value = await getCurrentUserData();
      universities.value = await fetchUniversities();
      loadCoffeeShops();
    }

    onMounted();

    // Actualizar cafetería
    const handleUpdate = async (nombre, field, newValue) => {
      let rules;
      if (field === "Telefono") {
        rules = phoneRules;
      } else if (field === "Pin") {
        rules = pinRules;
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
        const updatedData = {
          [field]: field === "Universidad" ? newValue.value : newValue,
        };
        await updateCoffeeShop(nombre, updatedData);

        rows.value = rows.value.map((r) =>
          r.Nombre === nombre
            ? {
                ...r,
                [field]: field === "Universidad" ? newValue.value : newValue,
              }
            : r
        );

        $q.notify({
          type: "positive",
          message: `Cafetería ${nombre} actualizada correctamente`,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al actualizar la cafetería",
        });
      }
    };

    // Añadir nueva cafetería
    const handleAdd = async () => {
      if (
        !newCoffeeShop.value.Nombre ||
        !newCoffeeShop.value.Horario ||
        !newCoffeeShop.value.Telefono ||
        !newCoffeeShop.value.Pin ||
        !newCoffeeShop.value.Universidad
      ) {
        $q.notify({
          type: "negative",
          message: "Rellene los campos obligatorios",
        });
        return;
      }

      // Validar teléfono y pin
      const phoneIsValid = phoneRules.every(
        (rule) => rule(newCoffeeShop.value.Telefono) === true
      );
      const pinIsValid = pinRules.every(
        (rule) => rule(newCoffeeShop.value.Pin) === true
      );

      if (!phoneIsValid) {
        $q.notify({
          type: "negative",
          message: "El teléfono no cumple con las reglas de validación",
        });
        return;
      }

      if (!pinIsValid) {
        $q.notify({
          type: "negative",
          message: "El pin no cumple con las reglas de validación",
        });
        return;
      }

      try {
        await addCoffeeShop(data.value.Nombre, newCoffeeShop.value);

        rows.value.push({
          ...newCoffeeShop.value,
          Universidad: newCoffeeShop.value.Universidad.value,
        });
        createCoffeeShop.value = false;

        $q.notify({
          type: "positive",
          message: `Cafetería añadida correctamente`,
        });

        // Limpiar los campos del formulario
        newCoffeeShop.value = {
          Nombre: "",
          Horario: "",
          Telefono: "",
          Menu: "",
          Universidad: "",
          Pin: "",
          Url_Logo: "",
        };

        closeDialog();
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al añadir la cafetería",
        });
      }
    };

    // Eliminar cafetería
    const handleDelete = async (nombre) => {
      try {
        await deleteCoffeeShop(nombre);

        rows.value = rows.value.filter((r) => r.Nombre !== nombre);

        $q.notify({
          type: "positive",
          message: `Cafetería ${nombre} eliminada correctamente`,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Error al eliminar la cafetería",
        });
      }
    };

    return {
      columns,
      rows,
      phoneRules,
      inputRules,
      pinRules,
      handleUpdate,
      handleAdd,
      handleDelete,
      universities,
      createCoffeeShop,
      createCoffeeShopDialog,
      closeDialog,
      newCoffeeShop,
    };
  },
});
</script>
