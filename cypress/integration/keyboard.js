describe('Keyboard nav', function () {
    it('supports keyboard nav', function () {
        // https://on.cypress.io/visit
        cy.visit('http://localhost:8080/plain.html');
        cy.get(`#1-head`).click();
        // cy.get(`#1-head`).click();
    });
});
