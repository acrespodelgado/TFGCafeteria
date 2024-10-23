import { db } from "src/boot/firebase";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { fetchCompanies } from "src/components/company";
import { fetchBonusType } from "src/components/bonus";
import CryptoJS from "crypto-js";

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
const register = async (
  email,
  password,
  name,
  surname,
  dni,
  phone,
  university
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const companies = await fetchCompanies();
    const bonusType = await fetchBonusType();

    // Guardar los datos en Alumno
    await addDoc(collection(db, "Alumno"), {
      Uid: user.uid,
      Nombre: name,
      Apellidos: surname,
      Dni: dni,
      Telefono: phone,
      Universidad: university,
    });

    // Crear un Tarjetero por cada empresa y encripto el uid del usuario en sha256 con plugin cryptoJS
    companies.forEach(async (companyName) => {
      const walletRef = await addDoc(collection(db, "Tarjetero"), {
        Direccion: CryptoJS.SHA256(user.uid).toString(CryptoJS.enc.Hex),
        Id_Alumno: user.uid,
        Id_Empresa: companyName,
      });

      // Crear una entrada en Disponibilidad_bono por cada tipo de bono
      bonusType.forEach(async (bonus) => {
        await addDoc(collection(db, "Disponibilidad_Bono"), {
          Id_Tarjetero: walletRef.id,
          Tipo_Bono: bonus,
          Usos: 0,
        });
      });
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
