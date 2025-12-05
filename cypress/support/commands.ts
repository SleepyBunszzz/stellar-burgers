declare global {
  namespace Cypress {
    interface Chainable {
      addIngredient(ingredientName: string): Chainable<void>;
      closeModal(): Chainable<void>;
      createOrder(): Chainable<void>;
      login(email?: string, password?: string): Chainable<void>;
      dragIngredient(ingredientName: string): Chainable<void>;
      loginWithTokens(accessToken?: string, refreshToken?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('addIngredient', (ingredientName: string) => {
  cy.contains(ingredientName)
    .parent()
    .parent()
    .find('button')
    .contains('Добавить')
    .click();
});

Cypress.Commands.add('dragIngredient', (ingredientName: string) => {
  cy.log('dragIngredient: skip - no DnD handlers in app');
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[class*="modal"] button[aria-label="Закрыть"]').click();
  cy.get('[class*="modal"]').should('not.exist');
});

Cypress.Commands.add('createOrder', () => {
  cy.get('button').contains('Оформить заказ').click();
});

Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.intercept('POST', '**/auth/login', { fixture: 'user.json' }).as('login');
  cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');

  cy.visit('/login');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button[type=submit]').click();

  cy.wait('@login');

  cy.setCookie('accessToken', 'test-access-token');
  cy.setCookie('refreshToken', 'test-refresh-token');

  cy.url().should('not.include', '/login');
});

Cypress.Commands.add(
  'loginWithTokens',
  (accessToken: string = 'test-access-token', refreshToken: string = 'test-refresh-token') => {
    cy.setCookie('accessToken', accessToken);
    cy.window().then((win) => {
      window.localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
    });
  }
);

export {};
