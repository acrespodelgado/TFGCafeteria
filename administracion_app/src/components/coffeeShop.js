import { ref } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "src/boot/firebase";

export const fetchCoffeeShopsByCompany = async (company) => {
  try {
    const q = query(
      collection(db, "Cafeteria"),
      where("Empresa", "==", company)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => doc.data());
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los datos de las cafeterias:", error);
    return [];
  }
};
