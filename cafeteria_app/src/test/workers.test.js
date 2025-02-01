import { ref } from "vue";
import { useWorkers } from "./workers.js";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Mock de Firebase Firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
}));

// Mock de src/boot/firebase
jest.mock("src/boot/firebase", () => ({
  db: {},
}));

describe("Workers Service", () => {
  let workersModule;
  const mockWorkers = [
    { Nombre: "Juan", Empresa: "Empresa1" },
    { Nombre: "Ana", Empresa: "Empresa2" },
    { Nombre: "Pedro", Empresa: "Empresa1" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    workersModule = useWorkers();
  });

  describe("fetchWorkers", () => {
    it("debe cargar los camareros correctamente", async () => {
      // Mock de Firestore
      const mockDocs = mockWorkers.map((worker) => ({
        data: () => worker,
      }));
      getDocs.mockResolvedValueOnce({ docs: mockDocs });

      await workersModule.fetchWorkers();

      expect(workersModule.workers.value).toEqual(mockWorkers);
      expect(collection).toHaveBeenCalledWith(expect.anything(), "Camarero");
    });

    it("debe manejar errores al cargar camareros", async () => {
      getDocs.mockRejectedValueOnce(new Error("Firestore error"));

      await expect(workersModule.fetchWorkers()).rejects.toThrow(
        "Error al obtener camareros"
      );
    });
  });

  describe("addWorker", () => {
    it("debe agregar un nuevo camarero correctamente", async () => {
      const mockNewWorker = {
        Nombre: "Maria",
        DNI: "12345678A",
        Telefono: "666555444",
      };

      // Configurar mocks
      addDoc.mockResolvedValueOnce({});
      getDocs.mockResolvedValueOnce({ docs: [] });

      await workersModule.addWorker(
        mockNewWorker.Nombre,
        mockNewWorker.DNI,
        mockNewWorker.Telefono
      );

      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        Nombre: "Maria",
        DNI: "12345678A",
        Telefono: "666555444",
      });
    });

    it("debe manejar errores al agregar camarero", async () => {
      addDoc.mockRejectedValueOnce(new Error("Firestore error"));

      await expect(
        workersModule.addWorker("Maria", "12345678A", "666555444")
      ).rejects.toThrow("Error al crear camarero");
    });
  });

  describe("groupWorkersByEmpresa", () => {
    it("debe agrupar camareros por empresa correctamente", () => {
      workersModule.workers.value = mockWorkers;

      const grouped = workersModule.groupWorkersByEmpresa();

      expect(grouped).toEqual({
        Empresa1: [
          { Nombre: "Juan", Empresa: "Empresa1" },
          { Nombre: "Pedro", Empresa: "Empresa1" },
        ],
        Empresa2: [{ Nombre: "Ana", Empresa: "Empresa2" }],
      });
    });

    it("debe manejar camareros sin empresa", () => {
      workersModule.workers.value = [...mockWorkers, { Nombre: "SinEmpresa" }];

      const grouped = workersModule.groupWorkersByEmpresa();

      expect(grouped["Sin Empresa"]).toEqual([{ Nombre: "SinEmpresa" }]);
    });
  });

  describe("getWorkersByEmpresa", () => {
    it("debe filtrar camareros por empresa correctamente", () => {
      workersModule.workers.value = mockWorkers;

      const empresa1Workers = workersModule.getWorkersByEmpresa("Empresa1");

      expect(empresa1Workers).toEqual([
        { Nombre: "Juan", Empresa: "Empresa1" },
        { Nombre: "Pedro", Empresa: "Empresa1" },
      ]);
    });

    it("debe devolver array vacío para empresa inexistente", () => {
      workersModule.workers.value = mockWorkers;

      const result = workersModule.getWorkersByEmpresa("EmpresaInexistente");

      expect(result).toEqual([]);
    });
  });
});
