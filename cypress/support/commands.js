const SELECTED_CLASS = 'node--selected';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("keydown", () => {
    cy.get(`body`).type('{downarrow}');
});
Cypress.Commands.add("keyup", () => {
    cy.get(`body`).type('{uparrow}');
});
Cypress.Commands.add("keyright", () => {
    cy.get(`body`).type('{rightarrow}');
});
Cypress.Commands.add("keyleft", () => {
    cy.get(`body`).type('{leftarrow}');
});
Cypress.Commands.add("escape", (path) => {
    return cy.get(`${path.replace(/\./g, '\\.')}`);
});
Cypress.Commands.add("selected", (path) => {
    cy.escape(path).should('have.class', SELECTED_CLASS);
});
