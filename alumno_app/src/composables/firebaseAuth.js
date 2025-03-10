import { db } from "src/boot/firebase";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { fetchCompanies } from "src/components/company";
import { fetchBonusType } from "src/components/bonus";
import CryptoJS from "crypto-js";

const auth = getAuth();

// Función para cerrar sesión
const logout = async (router) => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada con éxito.");
    router.push("/access");
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
    // Verificar si el DNI no existe en la base de datos
    const dniQuery = query(collection(db, "Alumno"), where("Dni", "==", dni));
    const dniSnapshot = await getDocs(dniQuery);

    if (!dniSnapshot.empty) {
      throw new Error("El DNI ya está registrado.");
    }

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
      DNI: dni,
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

    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email de verificación enviado");
    });

    //logout();
    return user;
  } catch (error) {
    console.error(error.message);
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

    if (!user.emailVerified) {
      await auth.signOut();
      throw new Error("Debe validar su email antes de iniciar sesión.");
    }

    console.log("Inicio de sesión exitoso: ", user);
    return user;
  } catch (error) {
    let errorMessage = "";
    switch (error.code) {
      case "auth/wrong-password":
        errorMessage =
          "Usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.";
        break;
      case "auth/user-not-found":
        errorMessage = "No se encontró una cuenta con este correo electrónico.";
        break;
      default:
        errorMessage = error.message;
        break;
    }
    throw new Error(errorMessage);
  }
};

// Función para obtener datos del usuario actual
const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No hay un usuario autenticado.");
    }

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
    console.error(error.message);
    throw error;
  }
};

const resetPassword = async (email) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      return true;
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};

export { auth, login, logout, register, getCurrentUserData, resetPassword };
