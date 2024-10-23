import { ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "src/boot/firebase";

const coffeeShops = ref([]);
const groupedCoffeeShops = ref({});

export const useCoffeeShop = () => {
  const fetchCoffeeShops = async () => {
    try {
      const coffeeShopCol = collection(db, "Cafeteria");
      const coffeeShopSnapshot = await getDocs(coffeeShopCol);
      coffeeShops.value = coffeeShopSnapshot.docs.map((doc) => ({
        name: doc.data().Nombre,
        url: doc.data().Url_Logo,
        value: doc.id,
        company: doc.data().Empresa,
        schedule: doc.data().Horario,
        phone: doc.data().Telefono,
        university: doc.data().Universidad,
        menu: doc.data().Menu,
      }));

      groupByCompany();
    } catch (error) {
      console.error("Error fetching coffeeShops: ", error);
    }
  };

  const groupByCompany = () => {
    groupedCoffeeShops.value = coffeeShops.value.reduce((acc, coffeeShop) => {
      const company = coffeeShop.company;
      if (!acc[company]) {
        acc[company] = [];
      }
      acc[company].push(coffeeShop);
      return acc;
    }, {});
  };

  return {
    coffeeShops,
    groupedCoffeeShops,
    fetchCoffeeShops,
  };
};
