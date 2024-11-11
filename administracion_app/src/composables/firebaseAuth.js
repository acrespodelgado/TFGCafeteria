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
        Validate: false,
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
    throw new Error("Error al iniciar sesión", error);
  }
};

// Función para obtener datos del usuario actual
const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser;
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
