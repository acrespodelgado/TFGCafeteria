export function isAuthenticated() {
  const authTime = localStorage.getItem("authTime");
  const expirationTime = 16 * 60 * 60 * 1000; // 16 horas en milisegundos, caduca a la jornada siguiente

  if (!authTime) {
    return false; // No autenticado
  }

  const currentTime = Date.now();
  const elapsedTime = currentTime - authTime;

  if (elapsedTime > expirationTime) {
    // Si ha pasado más de una hora, elimina la autenticación
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authTime");
    return false; // Autenticación caducada
  }

  return localStorage.getItem("isAuthenticated") === "true"; // Retorna el estado de autenticación
}
