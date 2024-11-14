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

// Listar tipos de bonos
export const fetchBonusType = async () => {
  try {
    const q = collection(db, "Tipo_Bono");
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => doc.data().Nombre);
    return result;
  } catch (error) {
    throw new Error("Error encontrando bonuses", error);
  }
};

// Agregar un nuevo tipo de bono
export const addBonusType = async (name) => {
  try {
    const q = collection(db, "Tipo_Bono");
    const queryRef = await addDoc(q, { Nombre: name });
    return queryRef.id;
  } catch (error) {
    throw new Error("Error al agregar el bono", error);
  }
};

// Actualizar el nombre de un bono
export const updateBonusType = async (oldName, newName) => {
  try {
    const q = query(
      collection(db, "Tipo_Bono"),
      where("Nombre", "==", oldName)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Tipo_Bono", queryDoc.id);

      await updateDoc(queryRef, { Nombre: newName });
    } else {
      throw new Error(`No se encontró el bono con el nombre ${oldName}`);
    }
  } catch (error) {
    throw new Error("Error al actualizar el bono", error);
  }
};

// Eliminar un tipo de bono
export const deleteBonusType = async (name) => {
  try {
    const q = query(collection(db, "Tipo_Bono"), where("Nombre", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Tipo_Bono", queryDoc.id);

      await deleteDoc(queryRef);
    } else {
      throw new Error(`No se encontró el bono con el nombre ${name}`);
    }
  } catch (error) {
    throw new Error("Error al eliminar el bono", error);
  }
};
