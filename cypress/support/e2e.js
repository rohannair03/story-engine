// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Suppress uncaught exception errors from the app
// during tests so they don't fail the test suite
Cypress.on('uncaught:exception', (err) => {
  console.error('Uncaught exception:', err.message);
  return false;
});