import { useRouter } from "vue-router";
import { useSelectedWorker } from "src/composables/useSelectedWorker";
import { useSelectedCoffeeShop } from "./useSelectedCoffeeShop";

export const useRedirectIfNoWorker = () => {
  const router = useRouter();
  const { selectedWorker } = useSelectedWorker();

  const redirectIfNoWorker = () => {
    useRedirectIfNoCoffeeShop();

    if (!selectedWorker.value) {
      router.push({
        name: "workers",
        query: { message: "Debes elegir un camarero" },
      });
      return false;
    }
    return true;
  };

  return { redirectIfNoWorker };
};

export const useRedirectIfNoCoffeeShop = () => {
  const router = useRouter();
  const { selectedCoffeeShop } = useSelectedCoffeeShop();

  const redirectIfNoCoffeeShop = () => {
    if (!selectedCoffeeShop.value) {
      router.push({
        name: "home",
        query: { message: "Debes elegir una cafetería" },
      });
      return false;
    }
    return true;
  };

  return { redirectIfNoCoffeeShop };
};
