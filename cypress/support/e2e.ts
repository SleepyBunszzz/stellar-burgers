import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  console.error('Cypress caught error:', err.message);
  return false;
});

Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'log').as('consoleLog');
  cy.spy(win.console, 'error').as('consoleError');
});

afterEach(() => {
  cy.window({ log: false }).then((win) => {
    try {
      window.localStorage.removeItem('refreshToken');
      window.localStorage.clear();
    } catch {
    }
  });
  cy.clearCookie('accessToken', { log: false });
  cy.clearCookies({ log: false });
});
