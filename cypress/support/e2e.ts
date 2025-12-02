import './commands';

// Игнорируем ошибки приложения
Cypress.on('uncaught:exception', (err, runnable) => {
  console.error('Cypress caught error:', err.message);
  return false;
});

// Логируем все запросы
Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'log').as('consoleLog');
  cy.spy(win.console, 'error').as('consoleError');
});