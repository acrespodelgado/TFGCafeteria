import { ref } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";

const bonusType = ref([]);

export const useBonusType = (db) => {
  const fetchBonusType = async () => {
    try {
      const bonusCol = collection(db, "Tipo_Bono");
      const bonusSnapshot = await getDocs(bonusCol);
      bonusType.value = bonusSnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error("Error fetching bonuses: ", error);
    }
  };

  const addBonusType = async (name) => {
    try {
      const bonusCol = collection(db, "Tipo_Bono");
      await addDoc(bonusCol, { Nombre: name });
      await fetchBonusType();
    } catch (error) {
      console.error("Error adding bonus: ", error);
    }
  };

  return {
    bonusType,
    fetchBonusType,
    addBonusType,
  };
};
