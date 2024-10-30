import { collection, query, where, getDocs } from "firebase/firestore";
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
