import { db } from "src/boot/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";

// Función para cargar las ventas
export const fetchSells = async () => {
  try {
    const sellsQuery = query(
      collection(db, "Transaccion"),
      where("Tipo", "==", "Venta")
    );
    const sellsSnapshot = await getDocs(sellsQuery);
    const sells = sellsSnapshot.docs.map((doc) => doc.data());
    return sells;
  } catch (error) {
    throw new Error("Error al obtener las transacciones de ventas", error);
  }
};

// Función para cargar las recargas
export const fetchRecharges = async () => {
  try {
    const rechargesQuery = query(
      collection(db, "Transaccion"),
      where("Tipo", "==", "Recarga")
    );
    const rechargesSnapshot = await getDocs(rechargesQuery);
    const recharges = rechargesSnapshot.docs.map((doc) => doc.data());
    return recharges;
  } catch (error) {
    throw new Error("Error al obtener las transacciones de recargas", error);
  }
};
