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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// Custom command to intercept the Claude API
// and return a controlled fake response
Cypress.Commands.add('mockClaudeAPI', (responseText) => {
  cy.intercept('POST', 'https://api.anthropic.com/v1/messages', {
    statusCode: 200,
    body: {
      content: [
        {
          type: 'text',
          text: responseText
        }
      ]
    }
  }).as('claudeAPI');
});

// Custom command to mock a Claude API error
Cypress.Commands.add('mockClaudeAPIError', () => {
  cy.intercept('POST', 'https://api.anthropic.com/v1/messages', {
    statusCode: 500,
    body: {
      error: { message: 'Internal server error' }
    }
  }).as('claudeAPIError');
});