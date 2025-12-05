/// <reference types="cypress" />

describe('Burger Constructor: ingredients & modal', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('ingredients');
    cy.visit('/');
    cy.wait('@ingredients');
  });

  it('adds one ingredient (main) and a bun into constructor', () => {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').first().click();
    cy.get('[data-cy=constructor-bun-1]').should('exist');
    cy.get('[data-cy=constructor-bun-2]').should('exist');

    cy.get('[data-cy=mains-ingredients]').contains('Добавить').first().click();
    cy.get('[data-cy=constructor-ingredients]')
      .find('[data-cy=constructor-item]')
      .should('have.length.at.least', 1);
  });

  it('ingredient modal opens and closes (close button and overlay)', () => {
    cy.get('[data-cy=ingredient-modal]').should('not.exist');

    cy.contains('Говяжий метеорит (отбивная)').click();
    cy.get('[data-cy=ingredient-modal]').should('exist');

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=ingredient-modal]').should('not.exist');

    cy.contains('Говяжий метеорит (отбивная)').click();
    cy.get('[data-cy=ingredient-modal]').should('exist');

    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=ingredient-modal]').should('not.exist');
  });
});

describe('Burger Constructor: order flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('ingredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('user');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('postOrder');

    cy.visit('/');
    cy.loginWithTokens();
    cy.wait('@ingredients');
  });

  it('creates order, shows correct number in modal, then clears constructor after close', () => {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').first().click();
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').first().click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').first().click();

    cy.get('[data-cy=constructor-bun-1]').should('exist');
    cy.get('[data-cy=constructor-bun-2]').should('exist');
    cy.get('[data-cy=constructor-ingredients]').find('li').should('have.length.at.least', 2);

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@postOrder');
    cy.contains('12345').should('exist');

    cy.get('[data-cy=modal-close]').click();
    cy.contains('12345').should('not.exist');
    cy.get('[data-cy=order-modal]').should('not.exist');

    cy.get('[data-cy=constructor-bun-1]').should('not.exist');
    cy.get('[data-cy=constructor-bun-2]').should('not.exist');
    cy.get('[data-cy=constructor-ingredients]')
      .find('[data-cy=constructor-item]')
      .should('have.length', 0);
  });
});
