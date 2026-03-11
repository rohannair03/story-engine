Cypress.Commands.add('mockClaudeAPI', (response) => {
  cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
    if (req.body.messages?.[0]?.content?.includes?.('Begin the story') ||
        req.body.messages?.some?.(m => m.role === 'user' && !m.content?.includes?.('Analyze this story scene'))) {
      req.reply({
        statusCode: 200,
        body: response
      });
    } else {
      req.continue();
    }
  }).as('claudeAPI');
});

Cypress.Commands.add('mockClaudeAPIError', () => {
  cy.intercept('POST', 'https://api.anthropic.com/v1/messages', {
    statusCode: 500,
    body: { error: { message: 'Internal Server Error' } }
  }).as('claudeAPIError');
});

Cypress.Commands.add('mockMusicAPI', (response) => {
  cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
    if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
      req.reply({
        statusCode: 200,
        body: response
      });
    } else {
      req.continue();
    }
  }).as('musicAPI');
});