import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "src/boot/firebase";

// Listar Cafeterías de una Empresa
export const fetchCoffeeShopsByCompany = async (company) => {
  try {
    const q = query(
      collection(db, "Cafeteria"),
      where("Empresa", "==", company)
    );
    const querySnapshot = await getDocs(q);
    const result = [];

    if (!querySnapshot.empty) {
      result.push(
        ...querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            Nombre: data.Nombre,
            Horario: data.Horario,
            Telefono: data.Telefono,
            Menu: data.Menu,
            Universidad: data.Universidad,
            Pin: data.Pin,
            Url_Logo: data.Url_Logo,
          };
        })
      );
    }

    return result;
  } catch (error) {
    console.error("Error al obtener los datos de las cafeterias:", error);
    return [];
  }
};

// Agregar una nueva cafeteria
export const addCoffeeShop = async (company, data) => {
  try {
    const q = collection(db, "Cafeteria");
    const queryRef = await addDoc(q, {
      Empresa: company,
      Nombre: data.Nombre,
      Horario: data.Horario,
      Telefono: data.Telefono,
      Menu: data.Menu,
      Universidad: data.Universidad.value,
      Pin: data.Pin,
      Url_Logo: data.Url_Logo,
    });
    return queryRef.id;
  } catch (error) {
    throw new Error("Error al agregar la cafeteria", error);
  }
};

// Actualizar los datos de una cafeteria
export const updateCoffeeShop = async (name, newData) => {
  try {
    const q = query(collection(db, "Cafeteria"), where("Nombre", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Cafeteria", queryDoc.id);

      await updateDoc(queryRef, newData);
    } else {
      throw new Error(`No se encontró la cafetería con nombre ${name}`);
    }
  } catch (error) {
    throw new Error("Error al actualizar los datos de la cafeteria", error);
  }
};

// Eliminar una cafeteria
export const deleteCoffeeShop = async (name) => {
  try {
    const q = query(collection(db, "Cafeteria"), where("Nombre", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Cafeteria", queryDoc.id);

      await deleteDoc(queryRef);
    } else {
      throw new Error(`No se encontró la cafetería con nombre ${name}`);
    }
  } catch (error) {
    throw new Error("Error al eliminar la cafetería", error);
  }
};
