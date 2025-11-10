import { TOrder, TIngredient } from '@utils-types';

export type TConstructorItemUI = TIngredient & { cid: string };

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TConstructorItemUI | null;
    ingredients: TConstructorItemUI[];
  };
  orderRequest: boolean;
  price: number;
  onOrderClick: () => void;
  onRemoveIngredient: (cid: string) => void;
  orderModalData?: TOrder | null;
};
