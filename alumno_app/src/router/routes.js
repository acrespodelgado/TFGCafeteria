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
        path: "chooseCoffeeShop",
        name: "chooseCoffeeShop",
        component: () => import("pages/ChooseCoffeeShopPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "coffeeShopList",
        name: "coffeeShopList",
        component: () => import("pages/CoffeeShopListPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "myBonuses",
        name: "myBonuses",
        component: () => import("pages/MyBonusesPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "myTransactions",
        name: "myTransactions",
        component: () => import("pages/MyTransactionsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "confirmation",
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
