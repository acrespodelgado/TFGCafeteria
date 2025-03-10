import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { auth } from "src/composables/firebaseAuth";
import { Notify } from "quasar";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Guardia de navegación
  Router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !auth.currentUser) {
      next("/access"); // Redirige a la página de acceso si no está autenticado
      Notify.create({
        type: "negative",
        message: "Debe iniciar sesión primero.",
        timeout: 1500,
      });
    } else {
      next(); // Continúa a la ruta solicitada
    }
  });

  return Router;
});
