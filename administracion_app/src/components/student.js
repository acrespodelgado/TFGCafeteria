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

export const fetchStudents = async () => {
  try {
    const q = query(collection(db, "Alumno"));
    const querySnapshot = await getDocs(q);
    const result = [];

    if (!querySnapshot.empty) {
      result = querySnapshot.docs.map((doc) => doc.data());
    }

    return result;
  } catch (error) {
    console.error("Error al obtener los datos de los alumnos:", error);
    return [];
  }
};

// Actualizar los datos de un alumno
export const updateStudent = async (dni, newData) => {
  try {
    const q = query(collection(db, "Alumno"), where("DNI", "==", dni));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Alumno", queryDoc.id);

      await updateDoc(queryRef, newData);
    } else {
      throw new Error(`No se encontró el alumno con el DNI: ${dni}`);
    }
  } catch (error) {
    throw new Error("Error al actualizar los datos del alumno: ", error);
  }
};

// Eliminar un alumno
export const deleteStudent = async (dni) => {
  try {
    const q = query(collection(db, "Alumno"), where("DNI", "==", dni));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Alumno", queryDoc.id);

      await deleteDoc(queryRef);
    } else {
      throw new Error(`No se encontró el alumno con el DNI: ${dni}`);
    }
  } catch (error) {
    throw new Error("Error al eliminar el alumno", error);
  }
};
