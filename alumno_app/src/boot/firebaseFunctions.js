import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth();

// Función para cerrar sesión
const logout = async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada con éxito.");
  } catch (error) {
    console.error("Error al cerrar sesión: ", error.message);
    throw error; // Puedes manejar el error o notificarlo en el componente
  }
};

// Función para registrar un nuevo usuario
const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Usuario registrado: ", user);
    return user; // Retorna el usuario si es necesario
  } catch (error) {
    console.error("Error al registrar el usuario: ", error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para iniciar sesión
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Inicio de sesión exitoso: ", user);
    return user;
  } catch (error) {
    console.error("Error al iniciar sesión: ", error.message);
    throw error;
  }
};

export { auth, login, logout, register };
