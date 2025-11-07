import { TOrder, TIngredient } from '@utils-types';

export type TConstructorItemUI = TIngredient & { id: string };

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TConstructorItemUI | null;
    ingredients: TConstructorItemUI[];
  };
  orderRequest: boolean;
  price: number;
  onOrderClick: () => void;
  onRemoveIngredient: (id: string) => void;
  orderModalData?: TOrder | null;
};
