describe("Pruebas de Inicio de Sesión", () => {
  beforeEach(() => {
    cy.visit("http://localhost:9000/#/"); // Navegar a la app antes de cada test
  });

  it("Debe permitir al usuario iniciar sesión", () => {
    cy.get("#email input").type("adri.cadiz16@gmail.com"); // Escribir email
    cy.get("#password input").type("admin1234"); // Escribir contraseña
    cy.get("#login-button").click(); // Hacer click en login
    cy.get("div.circlePrimary").should("exist"); // Verificar pantalla de elección de cafeteria
  });

  it("Debe mostrar un error si las credenciales son incorrectas", () => {
    cy.get("#email input").type("usuario@example.com");
    cy.get("#password input").type("incorrecta");
    cy.get("#login-button").click();
    cy.get(".q-notifications").should("exist"); // Verificar error
  });
});
