import { ref } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "src/boot/firebase";

const bonusType = ref([]);

// Listar Tipos de Bonos
export const useBonusType = () => {
  const fetchBonusType = async () => {
    try {
      const q = collection(db, "Tipo_Bono");
      const querySnapshot = await getDocs(q);
      bonusType.value = querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      throw new Error("Error al obtener bonuses: " + error);
    }
  };

  // Crear tipo de bono
  const addBonusType = async (name) => {
    try {
      const q = collection(db, "Tipo_Bono");
      await addDoc(q, { Nombre: name });
      await fetchBonusType();
    } catch (error) {
      throw new Error("Error al crear bono: " + error);
    }
  };

  return {
    bonusType,
    fetchBonusType,
    addBonusType,
  };
};
