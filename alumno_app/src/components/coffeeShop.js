import { ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "src/boot/firebase";

const coffeeShops = ref([]);
const groupedCoffeeShops = ref({});

// Listar Cafeterías
export const useCoffeeShop = () => {
  const fetchCoffeeShops = async () => {
    try {
      const q = collection(db, "Cafeteria");
      const querySnapshot = await getDocs(q);
      coffeeShops.value = querySnapshot.docs.map((doc) => ({
        Name: doc.data().Nombre,
        Url: doc.data().Url_Logo,
        value: doc.id,
        Company: doc.data().Empresa,
        Schedule: doc.data().Horario,
        Phone: doc.data().Telefono,
        University: doc.data().Universidad,
        Menu: doc.data().Menu,
      }));

      groupByCompany();
    } catch (error) {
      throw new Error("Error al obtener cafeterías: " + error);
    }
  };

  // Agrupar por Empresa
  const groupByCompany = () => {
    groupedCoffeeShops.value = coffeeShops.value.reduce((acc, coffeeShop) => {
      const company = coffeeShop.Company;
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
