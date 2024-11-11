import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "src/boot/firebase";

export const fetchCompanies = async () => {
  try {
    const companyQuery = query(collection(db, "Empresa"));
    const companySnapshot = await getDocs(companyQuery);
    const companies = companySnapshot.docs.map((doc) => doc.data().Nombre);
    return companies;
  } catch (error) {
    throw new Error("Error al obtener las empresas", error);
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
    throw new Error("Error al obtener la empresa", error);
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
    throw new Error("Error al obtener los datos de la empresa", error);
  }
};

export async function updateCompanyData(company, updatedData) {
  try {
    const q = query(collection(db, "Empresa"), where("Uid", "==", company));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const companyDoc = querySnapshot.docs[0];
      const companyRef = doc(db, "Empresa", companyDoc.id);

      await updateDoc(companyRef, updatedData);
      return true;
    } else {
      throw new Error("Empresa no encontrada.");
    }
  } catch (error) {
    throw new Error("Error al actualizar los datos de la empresa", error);
  }
}

export const updateCompanyColors = async (
  company,
  hexColor,
  hexColor2,
  hexColorText
) => {
  try {
    const q = query(collection(db, "Empresa"), where("Uid", "==", company));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const companyDoc = querySnapshot.docs[0];
      const companyRef = doc(db, "Empresa", companyDoc.id);

      await updateDoc(companyRef, {
        Color: hexColor,
        Color_2: hexColor2,
        Color_Text: hexColorText,
      });

      console.log("Colores actualizados con éxito.");
      return true;
    } else {
      throw new Error("Empresa no encontrada.");
    }
  } catch (error) {
    throw new Error("Error al actualizar los colores de la empresa:", error);
  }
};
