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

export const fetchWorkers = async (company) => {
  try {
    const q = query(
      collection(db, "Camarero"),
      where("Empresa", "==", company)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => doc.data());
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los datos de los camareros:", error);
    return [];
  }
};

// Agregar un nuevo camarero
export const addWorker = async (name, dni, phone, company) => {
  try {
    const workerRef = collection(db, "Camarero");
    const docRef = await addDoc(workerRef, {
      Nombre: name,
      DNI: dni,
      Telefono: phone,
      Empresa: company,
    });
    return docRef.id;
  } catch (error) {
    throw new Error("Error al agregar el camarero", error);
  }
};

// Actualizar los datos de un camarero
export const updateWorker = async (dni, newData) => {
  try {
    const workerQuery = query(
      collection(db, "Camarero"),
      where("DNI", "==", dni)
    );
    const workerSnapshot = await getDocs(workerQuery);

    if (!workerSnapshot.empty) {
      const workerDoc = workerSnapshot.docs[0];
      const workerRef = doc(db, "Camarero", workerDoc.id);

      await updateDoc(workerRef, newData);
    } else {
      throw new Error("No se encontró el camarero con el DNI: ", dni);
    }
  } catch (error) {
    throw new Error("Error al actualizar los datos del camarero: ", error);
  }
};

// Eliminar un camarero
export const deleteWorker = async (dni) => {
  try {
    const workerQuery = query(
      collection(db, "Camarero"),
      where("DNI", "==", dni)
    );
    const workerSnapshot = await getDocs(workerQuery);

    if (!workerSnapshot.empty) {
      const workerDoc = workerSnapshot.docs[0];
      const workerRef = doc(db, "Camarero", workerDoc.id);

      await deleteDoc(workerRef);
    } else {
      throw new Error("No se encontró el camarero con el DNI: ", dni);
    }
  } catch (error) {
    throw new Error("Error al eliminar el camarero", error);
  }
};
