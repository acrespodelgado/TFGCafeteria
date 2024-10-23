import { ref } from "vue";

const selectedCompany = ref(null);

export const useSelectedCompany = () => {
  const setSelectedCompany = (company) => {
    selectedCompany.value = company;
  };

  return {
    selectedCompany,
    setSelectedCompany,
  };
};
