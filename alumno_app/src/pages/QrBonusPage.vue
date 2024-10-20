<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md text-center">
      <h1>Tarjetero {{ selectedCompany ? selectedCompany : "" }}</h1>
      <h2>{{ bonusTypeUrl ? bonusTypeUrl : "" }}</h2>
      <qrcode-vue
        v-if="selectedWallet"
        :value="selectedWallet"
        :size="300"
        :margin="3"
      />
      <p>
        {{ bonusUsesUrl ? bonusUsesUrl + " Usos restantes" : "" }}
      </p>
    </div>
    <BackButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent } from "vue";
import { useSelectedCoffeeShop } from "src/selected/useSelectedCoffeeShop";
import { useSelectedWallet } from "src/selected/useSelectedWallet";
import { useSelectedCompany } from "src/selected/useSelectedCompany";
import { useRouter, useRoute } from "vue-router";
import BackButton from "src/layouts/BackButton.vue";
import QrcodeVue from "qrcode.vue";

export default defineComponent({
  name: "QrBonusPage",
  components: {
    BackButton,
    QrcodeVue,
  },

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute(); // Obtener la ruta actual
    const { selectedCoffeeShop } = useSelectedCoffeeShop();
    const { selectedWallet } = useSelectedWallet();
    const { selectedCompany } = useSelectedCompany();

    if (!selectedCoffeeShop.value) {
      $q.notify({
        icon: "error",
        color: "negative",
        message: "No se ha seleccionado ninguna cafetería",
      });
      router.push("/chooseCoffeeShop");
    }

    // Saneo el tipo de bonus
    const bonusTypeUrl = decodeURIComponent(
      route.params.bonusType || ""
    ).replace(/%20/g, " ");
    const bonusUsesUrl = route.params.uses;

    return {
      selectedCoffeeShop,
      selectedWallet,
      selectedCompany,
      bonusTypeUrl,
      bonusUsesUrl,
    };
  },
});
</script>
