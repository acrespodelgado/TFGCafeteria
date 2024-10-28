export const fetchUniversities = async () => {
  try {
    const response = await fetch("/assets/listado_grados.txt");
    const universitiesText = await response.text();
    const universities = universitiesText.split("\n").map((university) => {
      return { label: university.trim(), value: university.trim() };
    });
    return universities;
  } catch (error) {
    console.error("Error al cargar universidades:", error);
    return [];
  }
};
