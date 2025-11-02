// src/components/ui/burger-constructor/type.ts
import { TConstructorIngredient } from '@utils-types';

export type ConstructorItems = {
  bun: (TConstructorIngredient & { id: string }) | null;
  ingredients: Array<TConstructorIngredient & { id: string }>;
};

export type BurgerConstructorUIProps = {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  price: number;
  onOrderClick: () => void;
};
