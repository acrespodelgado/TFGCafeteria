const pinRules = [
  (val) => !!val || "* Obligatorio",
  (val) => /^\d{4}$/.test(val) || "Debe contener exactamente 4 números",
];

export { pinRules };
