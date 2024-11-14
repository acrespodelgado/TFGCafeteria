import { ref } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "src/boot/firebase";

const workers = ref([]);

// Listar Camareros
export const useWorkers = () => {
  const fetchWorkers = async () => {
    try {
      const q = collection(db, "Camarero");
      const querySnapshot = await getDocs(q);
      workers.value = querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      throw new Error("Error al obtener camareros: " + error);
    }
  };

  // Crear Camarero
  const addWorker = async (name, dni, tel) => {
    try {
      const q = collection(db, "Camarero");
      await addDoc(q, { Nombre: name, DNI: dni, Telefono: tel });
      await fetchWorkers();
    } catch (error) {
      throw new Error("Error al crear camarero: " + error);
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
