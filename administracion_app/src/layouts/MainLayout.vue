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

        <q-toolbar-title> App Administración </q-toolbar-title>
        <q-space />
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
        </q-avatar>
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
import { defineComponent, ref, onMounted, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { logout, auth } from "src/composables/firebaseAuth";
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
    const userEmail = ref(null);
    const authorizedEmail = "adrian.crespodelgado@alum.uca.es";

    const linksList = computed(() => [
      {
        title: "Home",
        caption: "",
        icon: "home",
        link: "home",
      },
      {
        title: "Administrar Cafetería",
        caption: "",
        icon: "local_cafe",
        link: "adminPanel",
      },
      {
        title: "Estadísticas",
        caption: "Información sobre las cafeterías",
        icon: "analytics",
        link: "statistics",
      } /*
      ...(userEmail.value === authorizedEmail
        ? [*/,
      {
        title: "Administración general",
        caption: "Panel de administración general",
        icon: "settings",
        link: "settings",
      } /*
          ]
        : []),*/,
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
            Notify.create({
              type: "negative",
              message: "Error al cerrar sesión. Inténtalo de nuevo.",
              timeout: 1500,
            });
          }
        },
      },
    ]);

    // Función para obtener el email del usuario autenticado
    const fetchUserEmail = () => {
      const user = auth.currentUser;
      if (user) {
        userEmail.value = user.email;
        if (userEmail.value === authorizedEmail) {
          router.go(); // Fuerza la recarga de la página cuando el usuario tiene el email autorizado
        }
      } else {
        router.push({ name: "access" });
      }
    };

    onMounted(() => {
      fetchUserEmail();
    });

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
