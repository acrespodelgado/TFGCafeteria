import { ref } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "src/boot/firebase";

const workers = ref([]);

export const useWorkers = () => {
  const fetchWorkers = async () => {
    try {
      const workersCol = collection(db, "Camarero");
      const workerSnapshot = await getDocs(workersCol);
      workers.value = workerSnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error("Error fetching workers: ", error);
    }
  };

  const addWorker = async (name, dni, tel) => {
    try {
      const workersCol = collection(db, "Camarero");
      await addDoc(workersCol, { Nombre: name, DNI: dni, Telefono: tel });
      await fetchWorkers();
    } catch (error) {
      console.error("Error adding worker: ", error);
    }
  };

  // Agrupar camareros por empresa
  const groupWorkersByEmpresa = () => {
    return workers.value.reduce((acc, worker) => {
      const empresa = worker.Empresa || "Sin Empresa";
      if (!acc[empresa]) {
        acc[empresa] = [];
      }
      acc[empresa].push(worker);
      return acc;
    }, {});
  };

  // Devuelvo un array con todos los camareros de una empresa
  const getWorkersByEmpresa = (empresa) => {
    return workers.value.filter((worker) => worker.Empresa === empresa);
  };

  return {
    workers,
    fetchWorkers,
    addWorker,
    groupWorkersByEmpresa,
    getWorkersByEmpresa,
  };
};
