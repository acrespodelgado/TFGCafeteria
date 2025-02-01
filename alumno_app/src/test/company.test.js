import { fetchCompanies, getCompanyByCoffeeShop } from "./company.js";
import { collection, getDocs, query, where } from "firebase/firestore";

// Mock de Firebase Firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock de src/boot/firebase
jest.mock("src/boot/firebase", () => ({
  db: {}, // Simula la instancia de Firestore
}));

describe("Companies Service", () => {
  beforeEach(() => {
    // Limpia todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  // Pruebas para fetchCompanies
  describe("fetchCompanies", () => {
    it("debe devolver una lista de nombres de empresas", async () => {
      // Simula la respuesta de Firestore
      const mockDocs = [
        { data: () => ({ Nombre: "Empresa1" }) },
        { data: () => ({ Nombre: "Empresa2" }) },
      ];
      getDocs.mockResolvedValueOnce({ docs: mockDocs });

      // Llama a la función
      const result = await fetchCompanies();

      // Verifica el resultado
      expect(result).toEqual(["Empresa1", "Empresa2"]);
      expect(collection).toHaveBeenCalledWith(expect.anything(), "Empresa");
      expect(getDocs).toHaveBeenCalled();
    });

    it("debe lanzar un error si falla la consulta", async () => {
      // Simula un error en Firestore
      getDocs.mockRejectedValueOnce(new Error("Error de Firestore"));

      // Verifica que la función lance un error
      await expect(fetchCompanies()).rejects.toThrow(
        "Error al obtener empresas"
      );
    });
  });

  // Pruebas para getCompanyByCoffeeShop
  describe("getCompanyByCoffeeShop", () => {
    it("debe devolver la empresa asociada a una cafetería", async () => {
      // Simula la respuesta de Firestore
      const mockDocs = [{ data: () => ({ Empresa: "Empresa1" }) }];
      const mockCollection = {}; // Simula la colección
      const mockWhere = {}; // Simula la condición where
      collection.mockReturnValueOnce(mockCollection); // Mock de collection
      where.mockReturnValueOnce(mockWhere); // Mock de where
      query.mockReturnValueOnce({}); // Mock de query
      getDocs.mockResolvedValueOnce({ docs: mockDocs, empty: false });

      // Llama a la función
      const result = await getCompanyByCoffeeShop("Cafeteria1");

      // Verifica el resultado
      expect(result).toBe("Empresa1");
      expect(collection).toHaveBeenCalledWith(expect.anything(), "Cafeteria");
      expect(query).toHaveBeenCalledWith(mockCollection, mockWhere);
      expect(getDocs).toHaveBeenCalled();
    });

    it("debe lanzar un error si no se encuentra la cafetería", async () => {
      // Simula que no se encuentra la cafetería
      getDocs.mockResolvedValueOnce({ empty: true });

      // Verifica que la función lance un error
      await expect(getCompanyByCoffeeShop("Cafeteria1")).rejects.toThrow(
        "Error al obtener empresa"
      );
    });

    it("debe lanzar un error si falla la consulta", async () => {
      // Simula un error en Firestore
      getDocs.mockRejectedValueOnce(new Error("Error de Firestore"));

      // Verifica que la función lance un error
      await expect(getCompanyByCoffeeShop("Cafeteria1")).rejects.toThrow(
        "Error al obtener empresa"
      );
    });
  });
});
