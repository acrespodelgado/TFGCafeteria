// bonus.test.js
import {
  fetchBonusType,
  addBonusType,
  updateBonusType,
  deleteBonusType,
} from "./bonus.js";

// Mock de Firebase Firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})), // Mock de getFirestore
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(), // Mock de getDocs
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
}));

// Mock de src/boot/firebase
jest.mock("src/boot/firebase", () => ({
  db: {}, // Simula la instancia de Firestore
}));

// Importa las funciones de Firebase después de mockearlas
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} = require("firebase/firestore");

describe("Bonus Service", () => {
  beforeEach(() => {
    // Limpia todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  // Pruebas para fetchBonusType
  describe("fetchBonusType", () => {
    it("debe devolver una lista de nombres de bonos", async () => {
      // Simula la respuesta de Firestore
      const mockDocs = [
        { data: () => ({ Nombre: "Bono1" }) },
        { data: () => ({ Nombre: "Bono2" }) },
      ];
      getDocs.mockResolvedValueOnce({ docs: mockDocs });

      // Llama a la función
      const result = await fetchBonusType();

      // Verifica el resultado
      expect(result).toEqual(["Bono1", "Bono2"]);
      expect(collection).toHaveBeenCalledWith(expect.anything(), "Tipo_Bono");
      expect(getDocs).toHaveBeenCalled();
    });

    it("debe lanzar un error si falla la consulta", async () => {
      // Simula un error en Firestore
      getDocs.mockRejectedValueOnce(new Error("Error de Firestore"));

      // Verifica que la función lance un error
      await expect(fetchBonusType()).rejects.toThrow(
        "Error encontrando bonuses"
      );
    });
  });

  // Pruebas para addBonusType
  // bonus.test.js
  describe("addBonusType", () => {
    it("debe agregar un nuevo tipo de bono y devolver su ID", async () => {
      // Simula la respuesta de Firestore
      const mockId = "123";
      const mockCollection = {}; // Simula la colección
      collection.mockReturnValueOnce(mockCollection); // Mock de collection
      addDoc.mockResolvedValueOnce({ id: mockId });

      // Llama a la función
      const result = await addBonusType("NuevoBono");

      // Verifica el resultado
      expect(result).toBe(mockId);
      expect(collection).toHaveBeenCalledWith(expect.anything(), "Tipo_Bono");
      expect(addDoc).toHaveBeenCalledWith(mockCollection, {
        Nombre: "NuevoBono",
      });
    });
  });

  it("debe lanzar un error si falla la inserción", async () => {
    // Simula un error en Firestore
    addDoc.mockRejectedValueOnce(new Error("Error de Firestore"));

    // Verifica que la función lance un error
    await expect(addBonusType("NuevoBono")).rejects.toThrow(
      "Error al agregar el bono"
    );
  });
});

// Pruebas para updateBonusType
describe("updateBonusType", () => {
  it("debe actualizar el nombre de un bono existente", async () => {
    // Simula la respuesta de Firestore
    const mockDocs = [{ id: "123" }];
    const mockCollection = {}; // Simula la colección
    const mockWhere = {}; // Simula la condición where
    collection.mockReturnValueOnce(mockCollection); // Mock de collection
    where.mockReturnValueOnce(mockWhere); // Mock de where
    query.mockReturnValueOnce({}); // Mock de query
    getDocs.mockResolvedValueOnce({ docs: mockDocs, empty: false });

    // Llama a la función
    await updateBonusType("BonoViejo", "BonoNuevo");

    // Verifica que se llamen las funciones correctas
    expect(collection).toHaveBeenCalledWith(expect.anything(), "Tipo_Bono");
    expect(query).toHaveBeenCalledWith(mockCollection, mockWhere);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "Tipo_Bono", "123");
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      Nombre: "BonoNuevo",
    });
  });

  it("debe lanzar un error si no se encuentra el bono", async () => {
    // Simula que no se encuentra el bono
    getDocs.mockResolvedValueOnce({ empty: true });

    // Verifica que la función lance un error
    await expect(updateBonusType("BonoViejo", "BonoNuevo")).rejects.toThrow(
      "No se encontró el bono con el nombre BonoViejo"
    );
  });

  it("debe lanzar un error si falla la actualización", async () => {
    // Simula la respuesta de Firestore
    const mockDocs = [{ id: "123" }];
    const mockCollection = {}; // Simula la colección
    const mockWhere = {}; // Simula la condición where
    collection.mockReturnValueOnce(mockCollection); // Mock de collection
    where.mockReturnValueOnce(mockWhere); // Mock de where
    query.mockReturnValueOnce({}); // Mock de query
    getDocs.mockResolvedValueOnce({ docs: mockDocs, empty: false });

    // Simula un error en Firestore al actualizar el documento
    updateDoc.mockRejectedValueOnce(new Error("Error de Firestore"));

    // Verifica que la función lance un error
    await expect(updateBonusType("BonoViejo", "BonoNuevo")).rejects.toThrow(
      "Error al actualizar el bono"
    );
  });
});

// Pruebas para deleteBonusType
describe("deleteBonusType", () => {
  it("debe eliminar un tipo de bono existente", async () => {
    // Simula la respuesta de Firestore
    const mockDocs = [{ id: "123" }];
    const mockCollection = {}; // Simula la colección
    const mockWhere = {}; // Simula la condición where
    collection.mockReturnValueOnce(mockCollection); // Mock de collection
    where.mockReturnValueOnce(mockWhere); // Mock de where
    query.mockReturnValueOnce({}); // Mock de query
    getDocs.mockResolvedValueOnce({ docs: mockDocs, empty: false });

    // Llama a la función
    await deleteBonusType("BonoAEliminar");

    // Verifica que se llamen las funciones correctas
    expect(collection).toHaveBeenCalledWith(expect.anything(), "Tipo_Bono");
    expect(query).toHaveBeenCalledWith(mockCollection, mockWhere);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "Tipo_Bono", "123");
    expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
  });

  it("debe lanzar un error si no se encuentra el bono", async () => {
    // Simula que no se encuentra el bono
    getDocs.mockResolvedValueOnce({ empty: true });

    // Verifica que la función lance un error
    await expect(deleteBonusType("BonoAEliminar")).rejects.toThrow(
      "No se encontró el bono con el nombre BonoAEliminar"
    );
  });

  it("debe lanzar un error si falla la eliminación", async () => {
    // Simula la respuesta de Firestore
    const mockDocs = [{ id: "123" }];
    const mockCollection = {}; // Simula la colección
    const mockWhere = {}; // Simula la condición where
    collection.mockReturnValueOnce(mockCollection); // Mock de collection
    where.mockReturnValueOnce(mockWhere); // Mock de where
    query.mockReturnValueOnce({}); // Mock de query
    getDocs.mockResolvedValueOnce({ docs: mockDocs, empty: false });

    // Simula un error en Firestore al eliminar el documento
    deleteDoc.mockRejectedValueOnce(new Error("Error de Firestore"));

    // Verifica que la función lance un error
    await expect(deleteBonusType("BonoAEliminar")).rejects.toThrow(
      "Error al eliminar el bono"
    );
  });
});
