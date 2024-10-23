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

// Función para registrar una nueva empresa
const registerCompany = async (email, password, name, companyName, phone) => {
  try {
    const companiesRef = collection(db, "Empresa");
    const q = query(companiesRef, where("Nombre", "==", companyName));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si existe una empresa con el mismo nombre, error
      throw new Error("Ya existe una empresa con ese nombre.");
    } else {
      // Creo el admin
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Guardar los datos en Empresa
      await addDoc(collection(db, "Empresa"), {
        Uid: user.uid,
        Propietario: name,
        Nombre: companyName,
        Telefono: phone,
        Url: "",
      });

      return user;
    }
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
    const adminQuery = query(
      collection(db, "Empresa"),
      where("uid", "==", user.uid)
    );
    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
      throw new Error("No se encontraron datos de la empresa.");
    }

    let adminData = {};
    adminSnapshot.forEach((doc) => {
      adminData = doc.data();
    });

    return adminData;
  } catch (error) {
    console.error("Error obteniendo datos de la empresa:", error);
    throw error;
  }
};

export { auth, login, logout, registerCompany, getCurrentUserData };
