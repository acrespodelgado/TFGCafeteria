module.exports = {
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1", // Mapea 'src/' a la carpeta src/
  },
  transform: {
    "^.+\\.js$": "babel-jest", // Usa babel-jest para transformar archivos .js
  },
  testEnvironment: "node", // Define el entorno de prueba como Node.js
  moduleFileExtensions: ["js"], // Define las extensiones de archivo que Jest debe manejar
};
