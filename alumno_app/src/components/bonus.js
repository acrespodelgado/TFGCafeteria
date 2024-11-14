import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "src/boot/firebase";
import { auth } from "src/composables/firebaseAuth";
import { useSelectedWallet } from "src/selected/useSelectedWallet";

// Listar los datos de la cafetería y los bonos
export const fetchBonusesCoffeeShopData = async (selectedCoffeeShop) => {
  if (!selectedCoffeeShop) {
    throw new Error("No se ha seleccionado ninguna cafetería");
  } else {
    try {
      // Buscar los datos de la cafetería
      const qCoffee = query(
        collection(db, "Cafeteria"),
        where("Nombre", "==", selectedCoffeeShop)
      );
      const qCoffeeSnapshot = await getDocs(qCoffee);
      const qCoffeeData = qCoffeeSnapshot.docs[0].data();

      // Buscar en tarjetero donde id_empresa coincide y id_alumno es igual al usuario actual
      const qWallet = query(
        collection(db, "Tarjetero"),
        where("Id_Empresa", "==", qCoffeeData.Empresa),
        where("Id_Alumno", "==", auth.currentUser.uid)
      );
      const qWalletSnapshot = await getDocs(qWallet);
      const qWalletData = qWalletSnapshot.docs[0].id;

      const { setSelectedWallet } = useSelectedWallet();
      setSelectedWallet(qWalletSnapshot.docs[0].data().Direccion);

      // Buscar los bonos en la colección disponibilidad_bono que coinciden con el id del tarjetero
      const qBonus = query(
        collection(db, "Disponibilidad_Bono"),
        where("Id_Tarjetero", "==", qWalletData)
      );

      const qBonusSnapshot = await getDocs(qBonus);
      const result = qBonusSnapshot.docs.map((doc) => doc.data());

      return {
        qCoffeeData,
        result,
      };
    } catch (error) {
      throw new Error("Error al obtener los datos: " + error);
    }
  }
};

// Listar tipos de bonos
export const fetchBonusType = async () => {
  try {
    const q = collection(db, "Tipo_Bono");
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => doc.data().Nombre);

    return result;
  } catch (error) {
    throw new Error("Error al obtener los datos: " + error);
  }
};
