declare namespace Cypress {
  interface Chainable {
    addIngredient(ingredientName: string): Chainable<void>;
    closeModal(): Chainable<void>;
    createOrder(): Chainable<void>;
    login(email?: string, password?: string): Chainable<void>;
    dragIngredient(ingredientName: string): Chainable<void>;
    loginWithTokens(accessToken?: string, refreshToken?: string): Chainable<void>;
  }
}