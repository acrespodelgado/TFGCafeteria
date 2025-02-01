import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "src/boot/firebase"; // Asegúrate de que la instancia de Firestore esté importada correctamente
import { getCompanyNameByUid } from "./company";

export const fetchSells = async (companyUid) => {
  const companyName = await getCompanyNameByUid(companyUid);
  try {
    const q = query(
      collection(db, "Transaccion"),
      where("Tipo", "==", "Venta"),
      where("Empresa", "==", companyName)
    );
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => doc.data());
    return result;
  } catch (error) {
    throw new Error("Error al obtener las transacciones de ventas", error);
  }
};

export const fetchRecharges = async (companyUid) => {
  const companyName = await getCompanyNameByUid(companyUid);
  try {
    const q = query(
      collection(db, "Transaccion"),
      where("Tipo", "==", "Recarga"),
      where("Empresa", "==", companyName)
    );
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => doc.data());
    return result;
  } catch (error) {
    throw new Error("Error al obtener las transacciones de recargas", error);
  }
};
