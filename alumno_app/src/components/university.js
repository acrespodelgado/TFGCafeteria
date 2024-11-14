// Listar Universidades
export const fetchUniversities = async () => {
  try {
    const response = await fetch("/assets/listado_grados.txt");
    const text = await response.text();
    const result = text.split("\n").map((university) => {
      return { label: university.trim(), value: university.trim() };
    });

    return result;
  } catch (error) {
    console.error("Error al cargar universidades:", error);
    return [];
  }
};
