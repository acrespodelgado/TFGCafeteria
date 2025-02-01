import { firebaseAuth } from "src/boot/firebase"; // Asegúrate de tener la importación correcta para Firebase Auth

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "access",
        name: "access",
        component: () => import("pages/AccessPage.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("pages/RegisterPage.vue"),
      },
      {
        path: "adminPanel",
        name: "adminPanel",
        component: () => import("pages/AdminPanelPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("pages/SettingsPage.vue"),
        meta: { requiresAuth: true },
        beforeEnter: (to, from, next) => {
          const user = firebaseAuth.currentUser;
          if (user && user.email === "adrian.crespodelgado@alum.uca.es") {
            next(); // Permite el acceso a la ruta
          } else {
            next({ name: "adminPanel" }); // Redirige si se es admin
          }
          a;
        },
      },
      {
        path: "statistics",
        name: "statistics",
        component: () => import("pages/StatisticsPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
