import { db } from "src/boot/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useSelectedWorker } from "src/composables/useSelectedWorker";
import { useSelectedCoffeeShop } from "src/composables/useSelectedCoffeeShop";

async function fetchWallet(qrCode) {
  const { selectedCoffeeShop } = useSelectedCoffeeShop();
  const company = selectedCoffeeShop.value.Empresa;

  try {
    const q = query(
      collection(db, "Tarjetero"),
      where("Direccion", "==", qrCode),
      where("Id_Empresa", "==", company)
    );
    const walletSnapshot = await getDocs(q);

    if (walletSnapshot.empty) {
      console.log("No se encontraron coincidencias");
      return null;
    }

    const doc = walletSnapshot.docs[0];
    const walletData = { id: doc.id, ...doc.data() };

    return walletData;
  } catch (error) {
    console.error("Error al buscar en Tarjetero:", error);
    throw error;
  }
}

export async function actionOnWallet(qrCode, action, bonusType) {
  try {
    const walletData = await fetchWallet(qrCode.value);

    if (!walletData) {
      console.log("No se encontró el tarjetero");
      return;
    }
    const walletId = walletData.id;

    const q = query(
      collection(db, "Disponibilidad_Bono"),
      where("Id_Tarjetero", "==", walletId),
      where("Tipo_Bono", "==", bonusType)
    );
    const disponibilitySnapshot = await getDocs(q);

    if (disponibilitySnapshot.empty) {
      console.log("No se encontró disponibilidad para este bono");
      return 0;
    }

    const doc = disponibilitySnapshot.docs[0];
    const disponibility = doc.data();
    let newUses = disponibility.Usos;

    if (action === "scan") {
      if (newUses > 0) {
        newUses -= 1;
      } else {
        console.log("El bono ya no tiene usos disponibles");
        return 0;
      }
    } else if (action === "recharge") {
      newUses += 10;
    }

    // Actualiza el documento con los nuevos usos
    await updateDoc(doc.ref, {
      Usos: newUses,
    });

    registerTransaction(qrCode, action, bonusType);

    console.log(`Acción ${action} realizada. Nuevos usos: ${newUses}`);
    return newUses;
  } catch (error) {
    console.error("Error procesando la acción:", error);
    throw error;
  }
}

async function registerTransaction(qrCode, action, bonusType) {
  try {
    const walletData = await fetchWallet(qrCode.value);
    const { selectedWorker } = useSelectedWorker();
    const { selectedCoffeeShop } = useSelectedCoffeeShop();
    const dateTime = new Date();

    if (!walletData) {
      console.log("No se encontró el tarjetero");
      return;
    }

    const walletIdStudent = walletData.Id_Alumno;

    const q = query(
      collection(db, "Alumno"),
      where("Uid", "==", walletIdStudent)
    );
    const studentSnapshot = await getDocs(q);

    const doc = studentSnapshot.docs[0];
    const studentData = { id: doc.id, ...doc.data() };

    const transactionData = {
      Alumno: studentData.Nombre + " " + studentData.Apellidos,
      Uid_Alumno: studentData.Uid,
      Camarero: selectedWorker.value.Nombre,
      Tipo_Bono: bonusType,
      Fecha: dateTime,
      Cafeteria: selectedCoffeeShop.value.Nombre,
      Tipo: action === "scan" ? "Venta" : "Recarga",
    };

    const transactionCol = collection(db, "Transaccion");
    await addDoc(transactionCol, transactionData);
  } catch (error) {
    console.error("Error registrando la transacción:", error);
    throw error;
  }
}
