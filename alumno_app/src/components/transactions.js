import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  startAt,
} from "firebase/firestore";
import { db } from "src/boot/firebase";
import { auth } from "src/composables/firebaseAuth";

// Listar todas las transacciones de un alumno
export const fetchTransaction = async () => {
  const transactions = [];
  try {
    const q = query(
      collection(db, "Transaccion"),
      where("Uid_Alumno", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return transactions;
  } catch (error) {
    throw new Error("Error: " + error);
  }
};

// Listar transacciones en los últimos 11 segundos
export const checkRecentTransactions = async () => {
  const result = [];
  const now = new Date();

  try {
    const q = query(
      collection(db, "Transaccion"),
      where("Uid_Alumno", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const queryData = doc.data();
      const queryDate = queryData.Fecha.toDate();

      if (queryDate >= new Date(now.getTime() - 11000)) {
        result.push({
          id: doc.id,
          ...queryData,
        });
      }
    });

    return result;
  } catch (error) {
    throw new Error("Error: " + error);
  }
};

// Función a ejecutar cada 10 segundos
export const monitorTransactions = (callback) => {
  setInterval(async () => {
    const recentTransactions = await checkRecentTransactions();
    if (recentTransactions.length > 0) {
      callback(recentTransactions[0]);
    }
  }, 10000);
};
