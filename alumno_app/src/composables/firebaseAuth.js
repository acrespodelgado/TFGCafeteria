import { db } from "src/boot/firebase";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const auth = getAuth();

// Función para cerrar sesión
const logout = async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada con éxito.");
  } catch (error) {
    console.error("Error al cerrar sesión: ", error.message);
    throw error;
  }
};

// Función para registrar un nuevo usuario
const register = async (email, password, name, surname, dni) => {
  try {
    // Registrar al usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Usuario registrado: ", user);

    // Guardar los datos del usuario en la colección "Alumno"
    await addDoc(collection(db, "Alumno"), {
      Uid: user.uid,
      Nombre: name,
      Apellidos: surname,
      Dni: dni,
    });

    return user;
  } catch (error) {
    console.error("Error al registrar el usuario: ", error.message);
    throw error;
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

// Función para obtener datos del usuario actual
const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser; // Obtiene el usuario autenticado actual
    if (!user) {
      throw new Error("No hay un usuario autenticado.");
    }

    // Consulta la colección Alumno utilizando el UID del usuario autenticado
    const studentQuery = query(
      collection(db, "Alumno"),
      where("uid", "==", user.uid)
    );
    const studentSnapshot = await getDocs(studentQuery);

    if (studentSnapshot.empty) {
      throw new Error("No se encontraron datos del alumno.");
    }

    let studentData = {};
    studentSnapshot.forEach((doc) => {
      studentData = doc.data();
    });

    return studentData;
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    throw error;
  }
};

export { auth, login, logout, register, getCurrentUserData };
