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
        path: "workers",
        name: "workers",
        component: () => import("pages/WorkersPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "bonusType/:action?",
        name: "bonusType",
        component: () => import("pages/BonusTypePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "cameraScan/:action?/:bonusType?",
        name: "cameraScan",
        component: () => import("pages/CameraScanPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "chooseAction",
        name: "chooseAction",
        component: () => import("pages/ChooseActionPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "confirmation/:action?/:bonusType?/:uses?",
        name: "confirmation",
        component: () => import("pages/ConfirmationPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
