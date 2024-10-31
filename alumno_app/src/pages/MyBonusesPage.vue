<template>
  <q-page>
    <h1>Enseña tu código QR a la persona encargada</h1>
    <h2 v-if="coffeeShopData" class="q-pt-none">
      Bonos {{ coffeeShopData.Empresa }}
    </h2>
    <div class="flex flex-center q-pa-xl">
      <div v-if="coffeeShopData" class="text-center q-my-lg">
        <qrcode-vue
          v-if="selectedWallet"
          :value="selectedWallet"
          :size="300"
          :margin="3"
        />

        <div class="q-gutter-md column q-mb-md">
          <q-btn
            label="Ver bonos"
            color="primary"
            @click="toolbar = true"
            rounded
          />
          <q-btn
            label="Cambiar cafetería"
            to="/chooseCoffeeShop"
            color="secondary"
            outline
            rounded
          />
        </div>

        <q-dialog v-model="toolbar" class="bonusDialog">
          <div v-if="bonuses" class="q-mb-md">
            <q-card>
              <q-toolbar>
                <q-space />
                <q-btn
                  flat
                  round
                  icon="close"
                  v-close-popup
                  color="secondary"
                />
              </q-toolbar>

              <q-card-section>
                <q-table
                  :rows="
                    bonuses.map((bonus) => ({
                      tipo_bono: bonus.Tipo_Bono,
                      usos: bonus.Usos,
                    }))
                  "
                  :columns="columns"
                  row-key="tipo_bono"
                  :title="selectedCoffeeShop"
                  flat
                  bordered
                  hide-bottom
                  virtual-scroll
                  separator="vertical"
                >
                  <template v-slot:body-cell-tipo_bono="props">
                    <q-td :props="props">
                      {{ props.row.Tipo_Bono }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-usos="props">
                    <q-td :props="props">
                      {{ props.row.Usos }}
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </q-dialog>
      </div>
    </div>
    <BackButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, onMounted, ref } from "vue";
import { useSelectedCoffeeShop } from "src/selected/useSelectedCoffeeShop";
import { useSelectedWallet } from "src/selected/useSelectedWallet";
import { useRouter } from "vue-router";
import { fetchBonusesCoffeeShopData } from "src/components/bonus";
import { monitorTransactions } from "src/components/transactions";
import BackButton from "src/layouts/BackButton.vue";
import QrcodeVue from "qrcode.vue";

export default defineComponent({
  name: "MyBonusesPage",
  components: {
    BackButton,
    QrcodeVue,
  },

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const { selectedCoffeeShop } = useSelectedCoffeeShop();
    const { selectedWallet } = useSelectedWallet();
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

    // Función para notificar si se ha usado código qr
    const notifyNewTransactions = (transaction) => {
      $q.notify({
        message: `Operación de ${transaction.Tipo} de ${transaction.Tipo_Bono} realizada con éxito`,
        color: "positive",
        icon: "check_circle",
      });
    };

    onMounted(() => {
      fetchBonuses();
      monitorTransactions(notifyNewTransactions);
    });

    const goToQrBonus = (bonusType, uses) => {
      router.push(`/qrBonus/${bonusType}/${uses}`);
    };

    return {
      selectedCoffeeShop,
      selectedWallet,
      coffeeShopData,
      bonuses,
      toolbar: ref(false),
      columns: [
        {
          name: "Tipo_Bono",
          label: "Tipo de Bono",
          field: "tipo_bono",
          align: "left",
        },
        {
          name: "Usos",
          label: "Usos Restantes",
          field: "usos",
          align: "right",
          sortable: true,
        },
      ],
      goToQrBonus,
    };
  },
});
</script>
