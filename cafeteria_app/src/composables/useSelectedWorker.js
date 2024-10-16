import { ref } from 'vue';

const selectedWorker = ref(null);

export const useSelectedWorker = () => {
    const setSelectedWorker = (worker) => {
        selectedWorker.value = worker;
    };

    return {
        selectedWorker,
        setSelectedWorker
    };
};