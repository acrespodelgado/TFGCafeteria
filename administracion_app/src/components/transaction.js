import { db } from "src/boot/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";

// Listar ventas
export const fetchSells = async () => {
  try {
    const q = query(
      collection(db, "Transaccion"),
      where("Tipo", "==", "Venta")
    );
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => doc.data());
    return result;
  } catch (error) {
    throw new Error("Error al obtener las transacciones de ventas", error);
  }
};

// Listar recargas
export const fetchRecharges = async () => {
  try {
    const q = query(
      collection(db, "Transaccion"),
      where("Tipo", "==", "Recarga")
    );
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => doc.data());
    return result;
  } catch (error) {
    throw new Error("Error al obtener las transacciones de recargas", error);
  }
};
