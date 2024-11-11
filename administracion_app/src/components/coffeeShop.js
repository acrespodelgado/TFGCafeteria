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

// Agregar una nueva cafeteria
export const addCoffeeShop = async (company, data) => {
  try {
    const coffeeShopRef = collection(db, "Cafeteria");
    const docRef = await addDoc(coffeeShopRef, {
      Empresa: company,
      Nombre: data.Nombre,
      Horario: data.Horario,
      Telefono: data.Telefono,
      Menu: data.Menu,
      Universidad: data.Universidad.value,
      Pin: data.Pin,
      Url_Logo: data.Url_Logo,
    });
    return docRef.id;
  } catch (error) {
    throw new Error("Error al agregar la cafeteria", error);
  }
};

// Actualizar los datos de una cafeteria
export const updateCoffeeShop = async (name, newData) => {
  try {
    const coffeeShopQuery = query(
      collection(db, "Cafeteria"),
      where("Nombre", "==", name)
    );
    const coffeeShopSnapshot = await getDocs(coffeeShopQuery);

    if (!coffeeShopSnapshot.empty) {
      const coffeeShopDoc = coffeeShopSnapshot.docs[0];
      const coffeeShopRef = doc(db, "Cafeteria", coffeeShopDoc.id);

      await updateDoc(coffeeShopRef, newData);
    } else {
      throw new Error("No se encontró la cafetería con nombre ", name);
    }
  } catch (error) {
    throw new Error("Error al actualizar los datos de la cafeteria", error);
  }
};

// Eliminar una cafeteria
export const deleteCoffeeShop = async (name) => {
  try {
    const coffeeShopQuery = query(
      collection(db, "Cafeteria"),
      where("Nombre", "==", name)
    );
    const coffeeShopSnapshot = await getDocs(coffeeShopQuery);

    if (!coffeeShopSnapshot.empty) {
      const coffeeShopDoc = coffeeShopSnapshot.docs[0];
      const coffeeShopRef = doc(db, "Cafeteria", coffeeShopDoc.id);

      await deleteDoc(coffeeShopRef);
    } else {
      throw new Error("No se encontró la cafetería con nombre ", name);
    }
  } catch (error) {
    throw new Error("Error al eliminar la cafetería", error);
  }
};
