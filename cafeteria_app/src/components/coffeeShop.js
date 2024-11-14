import { ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "src/boot/firebase";

const coffeeShops = ref([]);

// Listar Cafeterías
export const useCoffeeShop = () => {
  const fetchCoffeeShops = async () => {
    try {
      const q = collection(db, "Cafeteria");
      const querySnapshot = await getDocs(q);
      coffeeShops.value = querySnapshot.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().Nombre,
        Nombre: doc.data().Nombre,
        Url: doc.data().Url_Logo,
        Empresa: doc.data().Empresa,
        Telefono: doc.data().Telefono,
        Horario: doc.data().Horario,
      }));
    } catch (error) {
      throw new Error("Error al obtener cafeterías: " + error);
    }
  };

  return {
    coffeeShops,
    fetchCoffeeShops,
  };
};
