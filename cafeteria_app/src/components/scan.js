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

// Obtener Tarjetero
async function fetchWallet(qrCode) {
  const { selectedCoffeeShop } = useSelectedCoffeeShop();
  const company = selectedCoffeeShop.value.Empresa;

  try {
    const q = query(
      collection(db, "Tarjetero"),
      where("Direccion", "==", qrCode),
      where("Id_Empresa", "==", company)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("No se encontraron coincidencias: " + error);
    }

    const doc = querySnapshot.docs[0];
    const queryData = { id: doc.id, ...doc.data() };

    return queryData;
  } catch (error) {
    throw new Error("Error al obtener tarjetero: " + error);
  }
}

// Realizar accion en tarjetero
export async function actionOnWallet(qrCode, action, bonusType) {
  try {
    const qWalletData = await fetchWallet(qrCode.value);

    if (!qWalletData) {
      throw new Error("No se encontró el tarjetero");
    }
    const walletId = qWalletData.id;

    const q = query(
      collection(db, "Disponibilidad_Bono"),
      where("Id_Tarjetero", "==", walletId),
      where("Tipo_Bono", "==", bonusType)
    );
    const qDispoSnapshot = await getDocs(q);

    if (qDispoSnapshot.empty) {
      console.log("No se encontró disponibilidad para este bono");
      return 0;
    }

    const doc = qDispoSnapshot.docs[0];
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
    throw new Error("Error procesando la acción: " + error);
  }
}

// Registrar Transaccion
async function registerTransaction(qrCode, action, bonusType) {
  try {
    const { selectedWorker } = useSelectedWorker();
    const { selectedCoffeeShop } = useSelectedCoffeeShop();
    const qWalletData = await fetchWallet(qrCode.value);
    const dateTime = new Date();

    if (!qWalletData) {
      throw new Error("No se encontró el tarjetero");
    }

    const walletIdStudent = qWalletData.Id_Alumno;

    const qStud = query(
      collection(db, "Alumno"),
      where("Uid", "==", walletIdStudent)
    );
    const qStudSnapshot = await getDocs(qStud);

    const qStudDoc = qStudSnapshot.docs[0];
    const qStudData = { id: qStudDoc.id, ...qStudDoc.data() };

    const transactionData = {
      Alumno: qStudData.Nombre + " " + qStudData.Apellidos,
      Uid_Alumno: qStudData.Uid,
      Camarero: selectedWorker.value.Nombre,
      Tipo_Bono: bonusType,
      Fecha: dateTime,
      Cafeteria: selectedCoffeeShop.value.Nombre,
      Tipo: action === "scan" ? "Venta" : "Recarga",
    };

    const qTransCol = collection(db, "Transaccion");
    await addDoc(qTransCol, transactionData);
  } catch (error) {
    throw new Error("Error registrando la transacción: " + error);
  }
}
