import { ref } from "vue";

const selectedCoffeeShop = ref(null);

export const useSelectedCoffeeShop = () => {
  const setSelectedCoffeeShop = (coffeeShop) => {
    selectedCoffeeShop.value = coffeeShop;
  };

  return {
    selectedCoffeeShop,
    setSelectedCoffeeShop,
  };
};
