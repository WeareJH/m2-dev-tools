describe('Keyboard nav', function () {
    beforeEach(() => {
        cy.visit(Cypress.env('TEST_URL'));
    });
    it('down key focusses first element', function () {
        cy.get(`.node--active`).should('have.length', 0);
        cy.wait(300);
        cy.keydown();
        cy.selected('#0-head');
    });
    it('expand -> collapse node', function () {
        cy.get('.node').should('have.length', 3);
        cy.get(`#1-head`).click();
        cy.keyright();
        cy.get('.node').should('have.length', 9);
        cy.keyleft();
        cy.get('.node').should('have.length', 3);
    });
    it('respects top/bottom boundaries', function () {
        cy.wait(300);
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.selected('#2-head');
        cy.keyup();
        cy.keyup();
        cy.keyup();
        cy.keyup();
        cy.keyup();
        cy.selected('#0-head');
    });
    it('descends to first child when expanded and back', function() {
        cy.wait(300);
        cy.get(`#1-head`).click();
        cy.keyright();
        cy.keydown();
        cy.selected('#1.children.0-head');
        cy.keyleft();
        cy.selected('#1-head');
    });
    it('descends to parent tail from last child', function() {
        cy.wait(300);
        cy.get(`#1-head`).click();
        cy.keyright();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.selected(`#1-tail`);
    });
    it('descends to next sibling from tail', function() {
        cy.wait(300);
        cy.get(`#1-head`).click();
        cy.keyright();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.keydown();
        cy.selected(`#2-head`);
    });
});
