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
        label: doc.data().Nombre,
        url: doc.data().Url_Logo,
        value: doc.id,
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
