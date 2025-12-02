/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Добавляет ингредиент через кнопку "Добавить"
       */
      addIngredient(ingredientName: string): Chainable<void>;
      
      /**
       * Закрывает модальное окно
       */
      closeModal(): Chainable<void>;
      
      /**
       * Оформляет заказ
       */
      createOrder(): Chainable<void>;
      
      /**
       * Авторизует пользователя
       */
      login(email?: string, password?: string): Chainable<void>;
      
      /**
       * Перетаскивает ингредиент
       */
      dragIngredient(ingredientName: string): Chainable<void>;
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
  cy.contains(ingredientName)
    .parent()
    .parent()
    .trigger('dragstart');
  
  cy.get('[class*="burger_constructor"]')
    .trigger('dragover')
    .trigger('drop');
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[class*="modal"] button[aria-label="Закрыть"]').click();
  cy.get('[class*="modal"]').should('not.exist');
});

Cypress.Commands.add('createOrder', () => {
  cy.get('button').contains('Оформить заказ').click();
});

Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.intercept('POST', '/api/auth/login', { fixture: 'user.json' }).as('login');
  cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');
  
  cy.visit('/login');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button[type=submit]').click();
  cy.wait('@login');
  cy.url().should('not.include', '/login');
});

export {};