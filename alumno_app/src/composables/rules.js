const emailRules = [
  (val) => !!val || "* Obligatorio",
  (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
    "Por favor introduzca un correo electrónico válido", // Validación de formato de correo
];

const passwordRules = [
  (val) => !!val || "* Obligatorio", // Verifica que el campo no esté vacío
  (val) => /[A-Z]/.test(val) || "Debe contener al menos 1 mayúscula", // Verifica al menos 1 letra mayúscula
  (val) => /[0-9]/.test(val) || "Debe contener al menos 1 número", // Verifica al menos 1 dígito
  (val) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(val) ||
    "Debe contener al menos 1 carácter especial", // Verifica al menos 1 carácter especial
];

const dniRules = [
  (val) => !!val || "* Obligatorio", // Campo obligatorio
  (val) => /^[0-9]{8}[A-Z]$/.test(val) || "Formato de DNI inválido", // Validación básica de formato
];

export { emailRules, passwordRules, dniRules };
