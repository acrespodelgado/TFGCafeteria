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

// Obtener todas las transacciones de un alumno
export const fetchTransaction = async () => {
  const transactions = [];
  try {
    const transactionQuery = query(
      collection(db, "Transaccion"),
      where("Uid_Alumno", "==", auth.currentUser.uid)
    );

    const transactionSnapshot = await getDocs(transactionQuery);
    transactionSnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return transactions;
  } catch (error) {
    console.error("Error: ", error);
  }
};

// Función para obtener transacciones en los últimos 11 segundos
export const checkRecentTransactions = async () => {
  const transactions = [];
  const now = new Date();

  try {
    const transactionQuery = query(
      collection(db, "Transaccion"),
      where("Uid_Alumno", "==", auth.currentUser.uid)
    );

    const transactionSnapshot = await getDocs(transactionQuery);
    transactionSnapshot.forEach((doc) => {
      const transactionData = doc.data();
      const transactionDate = transactionData.Fecha.toDate();

      if (transactionDate >= new Date(now.getTime() - 11000)) {
        transactions.push({
          id: doc.id,
          ...transactionData,
        });
      }
    });

    return transactions;
  } catch (error) {
    console.error("Error: ", error);
    return [];
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
