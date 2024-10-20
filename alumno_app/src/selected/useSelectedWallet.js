import { ref } from "vue";

const selectedWallet = ref(null);

export const useSelectedWallet = () => {
  const setSelectedWallet = (wallet) => {
    selectedWallet.value = wallet;
  };

  return {
    selectedWallet,
    setSelectedWallet,
  };
};
