<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> App Alumno </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menú </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { logout } from "src/composables/firebaseAuth";
import { useRouter } from "vue-router";

const linksList = [
  {
    title: "Home",
    caption: "",
    icon: "home",
    link: "home",
  },
  {
    title: "Elegir Cafetería",
    caption: "",
    icon: "local_cafe",
    link: "chooseCoffeeShop",
  },
  {
    title: "Listado Cafeterías",
    caption: "Información sobre las cafeterías",
    icon: "store",
    link: "coffeeShopList",
  },
  {
    title: "Mis bonos",
    caption: "Mis bonos de una cafetería",
    icon: "wallet",
    link: { name: "myBonuses", query: { action: "coffeeShopSelected" } },
  },
  {
    title: "Tarjetero",
    caption: "Qr a escanear por la cafetería",
    icon: "qr_code",
    link: { name: "qrBonus", query: { action: "coffeeShopSelected" } },
  },
  {
    title: "Cerrar sesión",
    caption: "",
    icon: "logout",
    link: "",
    onClick: async () => {
      await logout();
      redirectLogin();
    },
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();

    const redirectLogin = () => {
      router.push("/access");
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      redirectLogin,
    };
  },
});
</script>
