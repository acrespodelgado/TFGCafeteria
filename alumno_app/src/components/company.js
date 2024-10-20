import { collection, getDocs, query } from "firebase/firestore";
import { db } from "src/boot/firebase";

export const fetchCompanies = async () => {
  try {
    const companyQuery = query(collection(db, "Empresa"));
    const companySnapshot = await getDocs(companyQuery);
    const companies = companySnapshot.docs.map((doc) => doc.data().Nombre);
    return companies;
  } catch (error) {
    console.error("Error al obtener las empresas: ", error.message);
    throw error;
  }
};
