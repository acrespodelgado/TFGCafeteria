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

// Listar camareros
export const fetchWorkers = async (company) => {
  try {
    const q = query(
      collection(db, "Camarero"),
      where("Empresa", "==", company)
    );
    const querySnapshot = await getDocs(q);
    const result = [];

    if (!querySnapshot.empty) {
      result = querySnapshot.docs.map((doc) => doc.data());
    }

    return result;
  } catch (error) {
    console.error("Error al obtener los datos de los camareros:", error);
    return [];
  }
};

// Agregar un nuevo camarero
export const addWorker = async (name, dni, phone, company) => {
  try {
    const q = collection(db, "Camarero");
    const queryRef = await addDoc(q, {
      Nombre: name,
      DNI: dni,
      Telefono: phone,
      Empresa: company,
    });
    return queryRef.id;
  } catch (error) {
    throw new Error("Error al agregar el camarero", error);
  }
};

// Actualizar los datos de un camarero
export const updateWorker = async (dni, newData) => {
  try {
    const q = query(collection(db, "Camarero"), where("DNI", "==", dni));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Camarero", queryDoc.id);

      await updateDoc(queryRef, newData);
    } else {
      throw new Error(`No se encontró el camarero con el DNI: ${dni}`);
    }
  } catch (error) {
    throw new Error("Error al actualizar los datos del camarero: ", error);
  }
};

// Eliminar un camarero
export const deleteWorker = async (dni) => {
  try {
    const q = query(collection(db, "Camarero"), where("DNI", "==", dni));
    const querySnapshot = await getDocs(queryQuery);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Camarero", queryDoc.id);

      await deleteDoc(queryRef);
    } else {
      throw new Error(`No se encontró el camarero con el DNI: ${dni}`);
    }
  } catch (error) {
    throw new Error("Error al eliminar el camarero", error);
  }
};
