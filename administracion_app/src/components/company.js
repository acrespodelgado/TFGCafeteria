import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db } from "src/boot/firebase";

// Listar Empresas
export const fetchCompanies = async () => {
  try {
    const q = query(collection(db, "Empresa"));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return result;
  } catch (error) {
    throw new Error("Error al obtener las empresas", error);
  }
};

// Obtener el nombre de la empresa a través del UID de la empresa
export const getCompanyNameByUid = async (companyUid) => {
  try {
    const q = query(collection(db, "Empresa"), where("Uid", "==", companyUid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const result = querySnapshot.docs[0].data().Nombre; // Obtenemos el nombre de la empresa
      return result;
    } else {
      throw new Error("Empresa no encontrada");
    }
  } catch (error) {
    throw new Error("Error al obtener el nombre de la empresa", error);
  }
};

// Obtener Empresa a través de Cafetería
export const getCompanyByCoffeeShop = async (coffeeShop) => {
  try {
    const q = query(
      collection(db, "Cafeteria"),
      where("Nombre", "==", coffeeShop)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const result = querySnapshot.docs[0].data().Empresa;
      return result;
    }
  } catch (error) {
    throw new Error("Error al obtener la empresa", error);
  }
};

// Leer datos de Empresa
export const getCompanyData = async (company) => {
  try {
    const q = query(collection(db, "Empresa"), where("Nombre", "==", company));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const result = querySnapshot.docs[0].data();
      return result;
    }
  } catch (error) {
    throw new Error("Error al obtener los datos de la empresa", error);
  }
};

// Actualizar datos de Empresa
export async function updateCompanyData(company, updatedData) {
  try {
    const q = query(collection(db, "Empresa"), where("Uid", "==", company));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Empresa", queryDoc.id);

      await updateDoc(queryRef, updatedData);
      return true;
    } else {
      throw new Error("Empresa no encontrada.");
    }
  } catch (error) {
    throw new Error("Error al actualizar los datos de la empresa:" + error);
  }
}

// Actualizar colores de Empresa
export const updateCompanyColors = async (
  company,
  hexColor,
  hexColor2,
  hexColorText
) => {
  try {
    const q = query(collection(db, "Empresa"), where("Uid", "==", company));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Empresa", queryDoc.id);

      await updateDoc(queryRef, {
        Color: hexColor,
        Color_2: hexColor2,
        Color_Text: hexColorText,
      });

      return true;
    } else {
      throw new Error("Empresa no encontrada.");
    }
  } catch (error) {
    throw new Error("Error al actualizar los colores de la empresa:", error);
  }
};

// Eliminar Empresa
export const deleteCompany = async (name) => {
  try {
    // 1. Seleccionar Empresa
    const qComp = query(collection(db, "Empresa"), where("Nombre", "==", name));
    const queryCompSnapshot = await getDocs(qComp);

    if (!queryCompSnapshot.empty) {
      const queryCompDoc = queryCompSnapshot.docs[0];
      const queryCompData = queryCompDoc.data();

      const queryCompRef = doc(db, "Empresa", queryCompDoc.id);

      // 2. Eliminar Camareros
      const qWork = query(
        collection(db, "Camarero"),
        where("Empresa", "==", name)
      );
      const qWorkSnapshot = await getDocs(qWork);

      const deleteWorkers = qWorkSnapshot.docs.map((doc) => deleteDoc(doc.ref));

      // 3. Eliminar Cafeterías
      const qCoffee = query(
        collection(db, "Cafeteria"),
        where("Empresa", "==", name)
      );
      const qCoffeeSnapshot = await getDocs(qCoffee);

      const deleteCoffeeShops = qCoffeeSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      // 3. Eliminar Tarjeteros y Disponibilidad_Bono
      const qWallet = query(
        collection(db, "Tarjetero"),
        where("Id_Empresa", "==", name)
      );
      const qWalletSnapshot = await getDocs(qWallet);

      const deleteWallets = qWalletSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      const qBonus = query(
        collection(db, "Disponibilidad_Bono"),
        where("Id_Empresa", "==", name)
      );
      const qBonusSnapshot = await getDocs(qBonus);

      const deleteBonus = qBonusSnapshot.docs.map((doc) => deleteDoc(doc.ref));

      // 4. Eliminar Transacciones
      const qTrans = query(
        collection(db, "Transaccion"),
        where("Empresa", "==", name)
      );
      const qTransSnapshot = await getDocs(qTrans);

      const deleteTransactions = qTransSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      // 5. Eliminar la empresa
      await deleteDoc(queryCompRef);

      /*
      // 6. Eliminar la cuenta de Firebase Auth asociada a la empresa (si tiene Uid)
      if (companyData.Uid) {
        const user = await auth.getUser(companyData.Uid);
        await deleteUser(user);
      }
        */

      await Promise.all([
        ...deleteWorkers,
        ...deleteCoffeeShops,
        ...deleteWallets,
        ...deleteBonus,
        ...deleteTransactions,
      ]);

      console.log(
        `Empresa, camareros, cafeterías y cuenta de auth eliminados para: ${name}`
      );
    } else {
      throw new Error(`No se encontró la empresa con el nombre: ${name}`);
    }
  } catch (error) {
    throw new Error(`Error al eliminar la empresa ${name}: ${error.message}`);
  }
};

// Validar Empresa
export const validateCompany = async (companyName) => {
  try {
    const q = query(
      collection(db, "Empresa"),
      where("Nombre", "==", companyName)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const queryDoc = querySnapshot.docs[0];
      const queryRef = doc(db, "Empresa", queryDoc.id);

      await updateDoc(queryRef, {
        Validate: true,
      });
    } else {
      throw new Error(
        "No se encontró la empresa con el nombre: " + companyName
      );
    }
  } catch (error) {
    throw new Error(
      "Error al actualizar la validación de la empresa: " + error.message
    );
  }
};
