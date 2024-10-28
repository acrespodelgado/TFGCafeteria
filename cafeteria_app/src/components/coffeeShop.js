import { ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "src/boot/firebase";

const coffeeShops = ref([]);

export const useCoffeeShop = () => {
  const fetchCoffeeShops = async () => {
    try {
      const coffeeShopCol = collection(db, "Cafeteria");
      const coffeeShopSnapshot = await getDocs(coffeeShopCol);
      coffeeShops.value = coffeeShopSnapshot.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().Nombre,
        Nombre: doc.data().Nombre,
        Url: doc.data().Url_Logo,
        Empresa: doc.data().Empresa,
        Telefono: doc.data().Telefono,
        Horario: doc.data().Horario,
      }));
    } catch (error) {
      console.error("Error fetching coffeeShops: ", error);
    }
  };

  return {
    coffeeShops,
    fetchCoffeeShops,
  };
};
