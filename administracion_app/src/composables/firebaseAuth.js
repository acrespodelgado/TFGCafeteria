import { db } from "src/boot/firebase";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

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
      // Creo el admin
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await addDoc(collection(db, "Empresa"), {
        Uid: user.uid,
        Propietario: name,
        Nombre: companyName,
        Telefono: phone,
        Url: "",
      });

      sendEmailVerification(auth.currentUser).then(() => {
        console.log("Email de verificación enviado");
      });

      return user;
    }
  } catch (error) {
    throw new Error("Error al registrar el usuario", error);
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

    // Comprobar si el email está verificado
    if (!user.emailVerified) {
      await auth.signOut();
      throw new Error(
        "Compruebe el email y valide la cuenta antes de iniciar sesión."
      );
    }

    console.log("Inicio de sesión exitoso: ", user);
    return user;
  } catch (error) {
    throw new Error("Usuario o contraseña incorrectos", error);
  }
};

// Función para obtener datos del usuario actual
const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser; // Obtiene el usuario autenticado actual
    if (!user) {
      throw new Error("No hay un usuario autenticado.");
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
