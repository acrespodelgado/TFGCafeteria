const emailRules = [
  (val) => !!val || "* Obligatorio",
  (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
    "Por favor introduzca un correo electrónico válido",
];

const passwordRules = [
  (val) => !!val || "* Obligatorio",
  (val) => /[A-Z]/.test(val) || "Debe contener al menos 1 mayúscula", // Verifica al menos 1 letra mayúscula
  (val) => /[0-9]/.test(val) || "Debe contener al menos 1 número", // Verifica al menos 1 dígito
  (val) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(val) ||
    "Debe contener al menos 1 carácter especial",
];

const repeatPasswordRules = [
  (val) => !!val || "* Obligatorio",
  (password) => (val) => val === password || "Las contraseñas deben coincidir",
];

const dniRules = [
  (val) => !!val || "* Obligatorio",
  (val) => /^[0-9]{8}[A-Z]$/.test(val) || "Formato de DNI inválido",
];

const inputRules = [(val) => !!val || "* Obligatorio"];

const validateForm = async (inputs) => {
  const validations = [
    emailRules.map((rule) => rule(inputs[0])), // Email
    passwordRules.map((rule) => rule(inputs[1])), // Password
    repeatPasswordRules.map((rule) => rule(inputs[2], inputs[1])), // Passwords iguales
    inputRules.map((rule) => rule(inputs[3])), // Nombre
    inputRules.map((rule) => rule(inputs[4])), // Apellidos
    dniRules.map((rule) => rule(inputs[5])), // DNI
  ];

  const results = validations.flat();
  return results.every((valid) => valid === true);
};

export { validateForm };
