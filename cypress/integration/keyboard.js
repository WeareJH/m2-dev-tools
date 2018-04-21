describe('Keyboard nav', function () {
    beforeEach(() => {
        cy.visit('http://localhost:8080/plain.html');
    });
    it('down key focusses first element', function () {
        cy.get(`.node--active`).should('have.length', 0);
        cy.wait(300);
        cy.get(`body`).type('{downarrow}');
        cy.get(`#0-head`).should('have.class', 'node--selected');
    });
    it('expand -> collapse node', function () {
        cy.get('.node').should('have.length', 3);
        cy.get(`#1-head`).click();
        cy.get('body').type('{rightarrow}');
        cy.get('.node').should('have.length', 9);
        cy.get('body').type('{leftarrow}');
        cy.get('.node').should('have.length', 3);
    });
    it('respects top/bottom boundaries', function () {
        cy.wait(300);
        cy.get(`body`).type('{downarrow}');
        cy.get(`body`).type('{downarrow}');
        cy.get(`body`).type('{downarrow}');
        cy.get(`body`).type('{downarrow}');
        cy.get(`body`).type('{downarrow}');
        cy.get(`#2-head`).should('have.class', 'node--selected');
        cy.get(`body`).type('{uparrow}');
        cy.get(`body`).type('{uparrow}');
        cy.get(`body`).type('{uparrow}');
        cy.get(`body`).type('{uparrow}');
        cy.get(`body`).type('{uparrow}');
        cy.get(`#0-head`).should('have.class', 'node--selected');
    });
});
