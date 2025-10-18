import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/user';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = {
    bun: null as TConstructorIngredient | null,
    ingredients: [] as TConstructorIngredient[]
  };

  const orderRequest = false;
  const orderModalData = null;

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
  };

  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
