export function isAuthenticated() {
  const authTime = localStorage.getItem("authTime");
  const expirationTime = 16 * 60 * 60 * 1000; // 16 horas en milisegundos, caduca a la jornada siguiente

  if (!authTime) {
    return false; // No autenticado
  }

  const currentTime = Date.now();
  const elapsedTime = currentTime - authTime;

  if (elapsedTime > expirationTime) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authTime");
    return false; // Autenticación caducada
  }

  return localStorage.getItem("isAuthenticated") === "true";
}
