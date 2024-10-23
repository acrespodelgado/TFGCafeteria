<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" id="bonusesPage">
      <div v-if="coffeeShopData" class="text-center">
        <h1>Bonos {{ coffeeShopData.Empresa }}</h1>
        <div v-if="bonuses" class="q-mb-md">
          <q-table
            :title="selectedCoffeeShop"
            :rows="
              bonuses.map((bonus) => ({
                tipo_bono: bonus.Tipo_Bono,
                usos: bonus.Usos,
              }))
            "
            :columns="columns"
            row-key="tipo_bono"
            flat
            bordered
            hide-bottom
            virtual-scroll
          >
            <template v-slot:top-right>
              <img
                style="width: 100px"
                :alt="coffeeShopData.Empresa"
                :src="coffeeShopData.Url_Logo"
            /></template>
            <template v-slot:body="props">
              <q-tr
                :props="props"
                @click="goToQrBonus(props.row.tipo_bono, props.row.usos)"
              >
                <q-td v-for="col in columns" :key="col.name" :props="props">
                  {{ props.row[col.field] }}
                </q-td>
              </q-tr>
            </template>

            <template v-slot:body-cell-tipo_bono="props">
              <q-td :props="props">
                {{ props.row.tipo_bono }}
              </q-td>
            </template>

            <template v-slot:body-cell-usos="props">
              <q-td :props="props">
                {{ props.row.usos }}
              </q-td>
            </template>
          </q-table>
        </div>
        <div class="q-gutter-md column q-mx-xs">
          <q-btn label="Comprar bono" to="/qrBonus" type="a" color="primary" />
          <q-btn
            label="Cambiar cafetería"
            to="/chooseCoffeeShop"
            color="secondary"
            type="a"
          />
        </div>
      </div>
    </div>
    <BackButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, onMounted, ref } from "vue";
import { useSelectedCoffeeShop } from "src/selected/useSelectedCoffeeShop";
import BackButton from "src/layouts/BackButton.vue";
import { useRouter } from "vue-router";
import { fetchBonusesCoffeeShopData } from "src/components/bonus";

export default defineComponent({
  name: "MyBonusesPage",
  components: {
    BackButton,
  },

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const { selectedCoffeeShop } = useSelectedCoffeeShop();
    const coffeeShopData = ref(null);
    const bonuses = ref([]);

    if (!selectedCoffeeShop.value) {
      router.push("/chooseCoffeeShop");
    }

    // Función para obtener los bonos y los datos de la cafetería
    const fetchBonuses = async () => {
      try {
        const result = await fetchBonusesCoffeeShopData(
          selectedCoffeeShop.value
        );
        coffeeShopData.value = result.coffeeShopData;
        bonuses.value = result.bonuses;
      } catch (error) {
        $q.notify({
          icon: "error",
          color: "negative",
          message: error.message,
        });
      }
    };

    onMounted(() => {
      fetchBonuses();
    });

    const goToQrBonus = (bonusType, uses) => {
      router.push(`/qrBonus/${bonusType}/${uses}`);
    };

    return {
      selectedCoffeeShop,
      coffeeShopData,
      bonuses,
      columns: [
        {
          name: "tipo_bono",
          label: "Tipo de Bono",
          field: "tipo_bono",
          align: "left",
        },
        {
          name: "usos",
          label: "Usos Restantes",
          field: "usos",
          align: "right",
        },
      ],
      goToQrBonus,
    };
  },
});
</script>
