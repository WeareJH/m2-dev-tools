describe('Search', function () {
    beforeEach(() => {
        cy.visit(Cypress.env('TEST_URL'));
    });
    it('shows only search results', function () {
        cy.get('#search').type('nosto');
        cy.get(`.node`).should('have.length', 12);
    });
});
