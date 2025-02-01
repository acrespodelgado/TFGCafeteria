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

    // Lista de enlaces comunes que todos los usuarios pueden ver
    const commonLinks = [
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
            Notify.create({
              type: "negative",
              message: "Error al cerrar sesión. Inténtalo de nuevo.",
              timeout: 1500,
            });
          }
        },
      },
    ];

    // Enlaces adicionales para administradores (solo visibles si es el usuario autorizado)
    const adminLinks = [
      {
        title: "Administración general",
        caption: "Panel de administración general",
        icon: "settings",
        link: "settings",
      },
    ];

    // Computamos los enlaces visibles dependiendo de si el usuario es administrador
    const linksList = ref([...commonLinks]); // Empieza solo con los enlaces comunes

    // Función para actualizar los enlaces según el tipo de usuario
    const updateLinksForAuthorizedUser = () => {
      if (userEmail.value === authorizedEmail) {
        // Si el usuario tiene el correo autorizado, solo mostramos los enlaces de administración y cerrar sesión
        linksList.value = [
          {
            title: "Administración general",
            caption: "Panel de administración general",
            icon: "settings",
            link: "settings",
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
                Notify.create({
                  type: "negative",
                  message: "Error al cerrar sesión. Inténtalo de nuevo.",
                  timeout: 1500,
                });
              }
            },
          },
        ];
      } else {
        // Si el usuario no es admin, mostramos los enlaces comunes
        linksList.value = [...commonLinks];
      }
    };

    // Función para obtener el email del usuario autenticado
    const fetchUserEmail = () => {
      const user = auth.currentUser;
      if (user && user.emailVerified) {
        userEmail.value = user.email;
        updateLinksForAuthorizedUser();
        // Redirigir a la página adecuada según el tipo de usuario
        if (userEmail.value === authorizedEmail) {
          // Si es el admin, redirigimos a Administracion
          router.push({ name: "settings" });
        } else {
          // Si no es admin, redirigimos a Home
          router.push({ name: "home" });
        }
      } else {
        // Si no está autenticado, redirigimos a la página de acceso
        router.push({ name: "access" });
      }
    };

    // Observamos el estado de autenticación
    onMounted(() => {
      auth.onAuthStateChanged(fetchUserEmail);
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
