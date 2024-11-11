const emailRules = [
  (val) => !!val || "* Obligatorio",
  (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Correo electrónico no válido",
];

const passwordRules = [
  (val) => !!val || "* Obligatorio",
  (val) => /[A-Z]/.test(val) || "Debe contener al menos 1 mayúscula", // Verifica al menos 1 letra mayúscula
  (val) => /[0-9]/.test(val) || "Debe contener al menos 1 número", // Verifica al menos 1 dígito
  (val) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(val) ||
    "Debe contener al menos 1 carácter especial",
];

const repeatPasswordRules = (password) => [
  (val) => !!val || "* Obligatorio",
  (val) => val === password || "Las contraseñas deben coincidir",
];

const pinRules = [
  (val) => !!val || "* Obligatorio",
  (val) => /^\d{4}$/.test(val) || "Debe contener exactamente 4 números",
];

const dniRules = [
  (val) => !!val || "* Obligatorio",
  (val) => /^[0-9]{8}[A-Z]$/.test(val) || "Formato de DNI inválido",
];

const inputRules = [(val) => !!val || "* Obligatorio"];

const phoneRules = [
  (val) => !!val || "* Obligatorio",
  (val) =>
    /^(6|7|9)[0-9]{8}$/.test(val) || "Formato de número de teléfono inválido",
];

const validateForm = async (inputs) => {
  const validations = [
    emailRules.map((rule) => rule(inputs[0])), // Email
    passwordRules.map((rule) => rule(inputs[1])), // Password
    repeatPasswordRules(inputs[1]).map((rule) => rule(inputs[2])), // Passwords iguales
    inputRules.map((rule) => rule(inputs[3])), // Nombre
    inputRules.map((rule) => rule(inputs[4])), // Nombre Empresa
    phoneRules.map((rule) => rule(inputs[5])), // Teléfono
  ];

  const results = validations.flat();
  return results.every((valid) => valid === true);
};

export {
  emailRules,
  passwordRules,
  repeatPasswordRules,
  pinRules,
  dniRules,
  inputRules,
  phoneRules,
  validateForm,
};
