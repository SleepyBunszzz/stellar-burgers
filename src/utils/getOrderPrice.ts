import { TIngredient, TOrder } from './types';

export const getOrderPrice = (
  order: TOrder,
  allIngredients: TIngredient[]
): number =>
  order.ingredients.reduce((sum, ingredientId) => {
    const ingredient = allIngredients.find((item) => item._id === ingredientId);

    return ingredient ? sum + ingredient.price : sum;
  }, 0);
