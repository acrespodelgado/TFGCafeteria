const pinRules = [
  (val) => !!val || "* Obligatorio",
  (val) => String(val).length === 4 || "Por favor introduzca 4 dígitos", // Validación de 4 dígitos
];

export { pinRules };
