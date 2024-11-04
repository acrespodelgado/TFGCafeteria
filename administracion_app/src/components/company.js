import { collection, getDocs, query, where } from "firebase/firestore";
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
    console.error("Error al obtener la empresa:", error);
  }
};

export const getCompanyData = async (company) => {
  try {
    const q = query(collection(db, "Empresa"), where("Nombre", "==", company));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const result = querySnapshot.docs[0];
      return result.data();
    }
  } catch (error) {
    console.error("Error al obtener los datos de la empresa:", error);
  }
};
