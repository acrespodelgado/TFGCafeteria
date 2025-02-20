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
    const qCheck = query(q, where("Nombre", "==", data.Nombre));
    const queryCheckSnapshot = await getDocs(qCheck);

    if (!queryCheckSnapshot.empty) {
      throw new Error("Ya existe una cafetería con este nombre.");
    }

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
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
};

// Eliminar una cafetería y sus transacciones asociadas
export const deleteCoffeeShop = async (name) => {
  try {
    const coffeeShopQuery = query(
      collection(db, "Cafeteria"),
      where("Nombre", "==", name)
    );
    const coffeeShopSnapshot = await getDocs(coffeeShopQuery);

    if (!coffeeShopSnapshot.empty) {
      // Eliminar la cafetería
      const coffeeShopDoc = coffeeShopSnapshot.docs[0];
      const coffeeShopRef = doc(db, "Cafeteria", coffeeShopDoc.id);
      await deleteDoc(coffeeShopRef);

      console.log(`Cafetería '${name}' eliminada correctamente.`);

      // Buscar y eliminar transacciones asociadas
      const transactionsQuery = query(
        collection(db, "Transaccion"),
        where("cafeteria", "==", name)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);

      const deletePromises = transactionsSnapshot.docs.map((transactionDoc) =>
        deleteDoc(doc(db, "Transaccion", transactionDoc.id))
      );

      await Promise.all(deletePromises);

      console.log(
        `Transacciones de la cafetería '${name}' eliminadas correctamente.`
      );
    } else {
      throw new Error(`No se encontró la cafetería con nombre ${name}`);
    }
  } catch (error) {
    throw new Error(
      `Error al eliminar la cafetería y sus transacciones: ${error.message}`
    );
  }
};
