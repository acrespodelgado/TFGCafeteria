import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "src/boot/firebase";
import { auth } from "src/composables/firebaseAuth";

// Función para obtener los datos de la cafetería y los bonos
export const fetchBonusesCoffeeShopData = async (selectedCoffeeShop) => {
  if (!selectedCoffeeShop) {
    throw new Error("No se ha seleccionado ninguna cafetería");
  } else {
    try {
      // Buscar los datos de la cafetería
      const coffeeShopQuery = query(
        collection(db, "Cafeteria"),
        where("Nombre", "==", selectedCoffeeShop)
      );
      const coffeeShopSnapshot = await getDocs(coffeeShopQuery);
      const coffeeShopData = coffeeShopSnapshot.docs[0].data();
      const company = coffeeShopData.Empresa;

      // Buscar en tarjetero donde id_empresa coincide y id_alumno es igual al usuario actual
      const walletQuery = query(
        collection(db, "Tarjetero"),
        where("Id_Empresa", "==", company),
        where("Id_Alumno", "==", auth.currentUser.uid)
      );
      const walletSnapshot = await getDocs(walletQuery);
      const walletData = walletSnapshot.docs[0].id;

      // Buscar los bonos en la colección disponibilidad_bono que coinciden con el id del tarjetero
      const bonusQuery = query(
        collection(db, "Disponibilidad_Bono"),
        where("Id_Tarjetero", "==", walletData)
      );

      const bonusSnapshot = await getDocs(bonusQuery);
      const bonuses = bonusSnapshot.docs.map((doc) => doc.data());

      return {
        coffeeShopData,
        bonuses,
      };
    } catch (error) {
      console.error("Error al obtener los datos: ", error.message);
      throw error;
    }
  }
};

// Obtener tipos de bonos
export const fetchBonusType = async () => {
  try {
    const bonusQuery = collection(db, "Tipo_Bono");
    const bonusSnapshot = await getDocs(bonusQuery);
    const bonusType = bonusSnapshot.docs.map((doc) => doc.data().Nombre);
    return bonusType;
  } catch (error) {
    console.error("Error fetching bonuses: ", error);
  }
};
