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

// Obtener tipos de bonos
export const fetchBonusType = async () => {
  try {
    const bonusQuery = collection(db, "Tipo_Bono");
    const bonusSnapshot = await getDocs(bonusQuery);
    const bonusType = bonusSnapshot.docs.map((doc) => doc.data().Nombre);
    return bonusType;
  } catch (error) {
    throw new Error("Error encontrando bonuses", error);
  }
};

// Agregar un nuevo tipo de bono
export const addBonusType = async (nombre) => {
  try {
    const bonusRef = collection(db, "Tipo_Bono");
    const docRef = await addDoc(bonusRef, { Nombre: nombre });
    return docRef.id;
  } catch (error) {
    throw new Error("Error al agregar el bono", error);
  }
};

// Actualizar el nombre de un bono
export const updateBonusType = async (nombreAntiguo, nombreNuevo) => {
  try {
    const bonusQuery = query(
      collection(db, "Tipo_Bono"),
      where("Nombre", "==", nombreAntiguo)
    );
    const bonusSnapshot = await getDocs(bonusQuery);

    if (!bonusSnapshot.empty) {
      const bonusDoc = bonusSnapshot.docs[0];
      const bonusRef = doc(db, "Tipo_Bono", bonusDoc.id);

      await updateDoc(bonusRef, { Nombre: nombreNuevo });
    } else {
      throw new Error("No se encontró el bono con el nombre ", nombreAntiguo);
    }
  } catch (error) {
    throw new Error("Error al actualizar el bono", error);
  }
};

// Eliminar un tipo de bono
export const deleteBonusType = async (nombre) => {
  try {
    const bonusQuery = query(
      collection(db, "Tipo_Bono"),
      where("Nombre", "==", nombre)
    );
    const bonusSnapshot = await getDocs(bonusQuery);

    if (!bonusSnapshot.empty) {
      const bonusDoc = bonusSnapshot.docs[0];
      const bonusRef = doc(db, "Tipo_Bono", bonusDoc.id);

      await deleteDoc(bonusRef);
    } else {
      throw new Error("No se encontró el bono con el nombre ", nombre);
    }
  } catch (error) {
    throw new Error("Error al eliminar el bono", error);
  }
};
