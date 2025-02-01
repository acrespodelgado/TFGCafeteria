import { db } from "src/boot/firebase";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  updateEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { fetchBonusType } from "src/components/bonus";
import CryptoJS from "crypto-js";

const auth = getAuth();
auth.useDeviceLanguage();

// Función para cerrar sesión
const logout = async (router) => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada con éxito.");
    router.push("/access");
  } catch (error) {
    throw new Error("Error al cerrar sesión", error);
  }
};

// Función para registrar una nueva empresa
const registerCompany = async (email, password, name, companyName, phone) => {
  try {
    const companiesRef = collection(db, "Empresa");
    const q = query(companiesRef, where("Nombre", "==", companyName));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Ya existe una empresa con ese nombre.");
    } else {
      // Crear el usuario con email y password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Registrar la empresa en la colección 'Empresa'
      await addDoc(collection(db, "Empresa"), {
        Uid: user.uid,
        Propietario: name,
        Nombre: companyName,
        Telefono: phone,
        Url: "",
        Validate: false,
      });

      // Ahora obtener todos los alumnos desde la colección 'Alumno'
      const studentsRef = collection(db, "Alumno");
      const studentsSnapshot = await getDocs(studentsRef);

      // Para cada alumno, crear una entrada en 'Tarjetero'
      const createdWalletIds = [];
      studentsSnapshot.forEach(async (studentDoc) => {
        const student = studentDoc.data();
        const studentUid = student.Uid; // UID del alumno

        // Crear la dirección asociada con el alumno
        const wallet = CryptoJS.SHA256(studentUid).toString(CryptoJS.enc.Hex);

        // Crear el registro en 'Tarjetero'
        const walletDocRef = await addDoc(collection(db, "Tarjetero"), {
          Id_Empresa: companyName,
          Id_Alumno: studentUid,
          Direccion: wallet,
        });

        createdWalletIds.push(walletDocRef.id); // Guardar el ID del tarjetero creado
        logout();
      });

      // Llamar a fetchBonusType para obtener todos los tipos de bono
      const bonusTypes = await fetchBonusType();

      // Para cada tipo de bono, crear un registro en 'Disponibilidad_Bono'
      for (const walletId of createdWalletIds) {
        for (const bonusType of bonusTypes) {
          await addDoc(collection(db, "Disponibilidad_Bono"), {
            Id_Tarjetero: walletId,
            Tipo_Bono: bonusType, // Asumiendo que fetchBonusType devuelve el tipo de bono
            Usos: 0, // Inicializamos los usos en 0
          });
        }
      }

      return user;
    }
  } catch (error) {
    throw new Error(error);
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

    if (email === "adrian.crespodelgado@alum.uca.es") {
      return user; // Retornamos el usuario sin comprobar la empresa
    }

    const companyQuery = query(
      collection(db, "Empresa"),
      where("Uid", "==", user.uid)
    );
    const companySnapshot = await getDocs(companyQuery);

    if (companySnapshot.empty) {
      throw new Error("No se encontró la empresa asociada al email.");
    }

    const companyData = companySnapshot.docs[0].data();

    if (companyData.Validate === false) {
      await auth.signOut();
      throw new Error(
        "El administrador debe validar su cuenta antes de iniciar sesión."
      );
    }

    return user;
  } catch (error) {
    throw new Error(`Error al iniciar sesión. ${error.message}`);
  }
};

// Función para obtener datos del usuario actual
const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No hay un usuario autenticado.");
    }

    if (user.email === "adrian.crespodelgado@alum.uca.es") {
      return {};
    }

    const adminQuery = query(
      collection(db, "Empresa"),
      where("Uid", "==", user.uid)
    );
    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
      throw new Error("No se encontraron datos de la empresa.", error);
    }

    let adminData = {};
    adminSnapshot.forEach((doc) => {
      adminData = doc.data();
    });

    return adminData;
  } catch (error) {
    throw new Error("Error obteniendo datos de la empresa", error);
  }
};

// Actualizar contraseña
const handleUpdatePassword = async (newPassword) => {
  const user = auth.currentUser;

  updatePassword(user, newPassword)
    .then(() => {
      return true;
    })
    .catch((error) => {
      throw new Error("Se ha producido un error", error);
    });
};

// Actualizar email
const handleUpdateEmail = async (newEmail) => {
  const user = auth.currentUser;

  updateEmail(user, newEmail)
    .then(() => {
      return true;
    })
    .catch((error) => {
      throw new Error("Se ha producido un error", error);
    });
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

export {
  auth,
  login,
  logout,
  registerCompany,
  getCurrentUserData,
  handleUpdatePassword,
  handleUpdateEmail,
  resetPassword,
};
