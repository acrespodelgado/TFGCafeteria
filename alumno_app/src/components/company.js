import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "src/boot/firebase";

// Listar Empresas
export const fetchCompanies = async () => {
  try {
    const q = query(collection(db, "Empresa"));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => doc.data().Nombre);

    return result;
  } catch (error) {
    throw new Error("Error al obtener empresas: " + error);
  }
};

// Obtener Empresa de una Cafetería
export const getCompanyByCoffeeShop = async (coffeeShop) => {
  try {
    const q = query(
      collection(db, "Cafeteria"),
      where("Nombre", "==", coffeeShop)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const result = querySnapshot.docs[0];
      return result.data().Empresa;
    }
  } catch (error) {
    throw new Error("Error al obtener empresa: " + error);
  }
};
