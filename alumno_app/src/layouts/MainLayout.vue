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
import { Notify } from "quasar";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();

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
        caption: "Listado de bonos y tarjetero",
        icon: "wallet",
        link: "myBonuses",
      },
      {
        title: "Cerrar sesión",
        caption: "",
        icon: "logout",
        link: "",
        onClick: async () => {
          try {
            await logout(router);
            Notify.create({
              type: "positive",
              message: "Sesión cerrada con éxito.",
              timeout: 1500,
            });
          } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
            Notify.create({
              type: "negative",
              message: "Error al cerrar sesión. Inténtalo de nuevo.",
              timeout: 1500,
            });
          }
        },
      },
    ];

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
