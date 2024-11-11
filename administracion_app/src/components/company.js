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

export const fetchCompanies = async () => {
  try {
    const companyQuery = query(collection(db, "Empresa"));
    const companySnapshot = await getDocs(companyQuery);
    const companies = companySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return companies;
  } catch (error) {
    throw new Error("Error al obtener las empresas", error);
  }
};

export const getCompanyByCoffeeShop = async (coffeeShop) => {
  try {
    const q = query(
      collection(db, "Cafeteria"),
      where("Nombre", "==", coffeeShop)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const result = querySnapshot.docs[0];
      return result.data().Empresa;
    }
  } catch (error) {
    throw new Error("Error al obtener la empresa", error);
  }
};

export const getCompanyData = async (company) => {
  try {
    const q = query(collection(db, "Empresa"), where("Nombre", "==", company));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const result = querySnapshot.docs[0];
      return result.data();
    }
  } catch (error) {
    throw new Error("Error al obtener los datos de la empresa", error);
  }
};

export async function updateCompanyData(company, updatedData) {
  try {
    const q = query(collection(db, "Empresa"), where("Uid", "==", company));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const companyDoc = querySnapshot.docs[0];
      const companyRef = doc(db, "Empresa", companyDoc.id);

      await updateDoc(companyRef, updatedData);
      return true;
    } else {
      throw new Error("Empresa no encontrada.");
    }
  } catch (error) {
    throw new Error("Error al actualizar los datos de la empresa", error);
  }
}

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
      const companyDoc = querySnapshot.docs[0];
      const companyRef = doc(db, "Empresa", companyDoc.id);

      await updateDoc(companyRef, {
        Color: hexColor,
        Color_2: hexColor2,
        Color_Text: hexColorText,
      });

      console.log("Colores actualizados con éxito.");
      return true;
    } else {
      throw new Error("Empresa no encontrada.");
    }
  } catch (error) {
    throw new Error("Error al actualizar los colores de la empresa:", error);
  }
};

export const deleteCompany = async (name) => {
  try {
    // 1. Buscar la empresa por nombre
    const companyQuery = query(
      collection(db, "Empresa"),
      where("Nombre", "==", name)
    );
    const companySnapshot = await getDocs(companyQuery);

    if (!companySnapshot.empty) {
      const companyDoc = companySnapshot.docs[0];
      const companyData = companyDoc.data();

      const companyRef = doc(db, "Empresa", companyDoc.id);

      // 2. Eliminar Camareros
      const workersQuery = query(
        collection(db, "Camarero"),
        where("Empresa", "==", name)
      );
      const workersSnapshot = await getDocs(workersQuery);

      const deleteWorkers = workersSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      // 3. Eliminar Cafeterías
      const coffeeShopQuery = query(
        collection(db, "Cafeteria"),
        where("Empresa", "==", name)
      );
      const coffeeShopSnapshot = await getDocs(coffeeShopQuery);

      const deleteCoffeeShops = coffeeShopSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      // 3. Eliminar Tarjeteros y Disponibilidad_Bono
      const walletQuery = query(
        collection(db, "Tarjetero"),
        where("Empresa", "==", name)
      );
      const walletSnapshot = await getDocs(walletQuery);

      const deleteWallets = walletSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      const bonusQuery = query(
        collection(db, "Tarjetero"),
        where("Empresa", "==", name)
      );
      const bonusSnapshot = await getDocs(bonusQuery);

      const deleteBonus = bonusSnapshot.docs.map((doc) => deleteDoc(doc.ref));

      // 4. Eliminar Transacciones
      const transactionQuery = query(
        collection(db, "Transaccion"),
        where("Empresa", "==", name)
      );
      const transactionSnapshot = await getDocs(transactionQuery);

      const deleteTransactions = transactionSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      // 5. Eliminar la empresa
      await deleteDoc(companyRef);

      /*
      // 6. Eliminar la cuenta de Firebase Auth asociada a la empresa (si tiene Uid)
      if (companyData.Uid) {
        const user = await auth.getUser(companyData.Uid);
        await deleteUser(user);
      }
        */

      // Esperar a que todas las promesas de eliminación (camareros, cafeterías) se completen
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

export const validateCompany = async (companyName) => {
  try {
    const companyQuery = query(
      collection(db, "Empresa"),
      where("Nombre", "==", companyName)
    );
    const companySnapshot = await getDocs(companyQuery);

    if (!companySnapshot.empty) {
      const companyDoc = companySnapshot.docs[0];
      const companyRef = doc(db, "Empresa", companyDoc.id);

      await updateDoc(companyRef, {
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
