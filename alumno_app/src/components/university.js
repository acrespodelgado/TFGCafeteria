export const fetchUniversities = async () => {
  try {
    const response = await fetch("/assets/listado_grados.txt");
    const universitiesText = await response.text();
    const universities = universitiesText.split("\n").map((university) => {
      return { label: university.trim(), value: university.trim() };
    });
    return universities; // Retorna el array
  } catch (error) {
    console.error("Error al cargar universidades:", error);
    return []; // Retorna un array vacío en caso de error
  }
};
