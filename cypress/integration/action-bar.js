describe('Action bar', function () {
    beforeEach(() => {
        cy.visit('http://localhost:8080/plain.html');
    });
    it('expand all', function () {
        cy.wait(300);
        cy.get('.node').should('have.length', 3);
        cy.expandAll()
        cy.get('.node').should('have.length', 167);
    });
    it('collapse all', function () {
        cy.wait(300);
        cy.get('.node').should('have.length', 3);
        cy.expandAll();
        cy.get('.node').should('have.length', 167);
        cy.collapseAll();
        cy.get('.node').should('have.length', 3);
    });
});
