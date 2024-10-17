import { useRouter } from "vue-router";
import { useSelectedWorker } from "src/composables/useSelectedWorker"; // Ajusta la ruta según sea necesario

export const useRedirectIfNoWorker = () => {
  const router = useRouter();
  const { selectedWorker } = useSelectedWorker();

  const redirectIfNoWorker = () => {
    if (!selectedWorker.value) {
      router.push({
        name: "workers",
        query: { message: "Debes elegir un camarero" },
      });
      return false; // Indica que la redirección ocurrió
    }
    return true; // Indica que se puede continuar
  };

  return { redirectIfNoWorker };
};
