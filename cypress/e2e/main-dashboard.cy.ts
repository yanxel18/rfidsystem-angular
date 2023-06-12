describe("Dashboard", () => {
  it("should display the dashboard", () => {
    cy.visit("/");
    cy.contains("ダッシュボード");
    cy.contains("在室人数");
    cy.contains("出社人数");
    cy.contains("在室率");
  });
});
