import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/user';
import { createOrder, selectOrderRequest } from '../../services/slices/orders';
import { BurgerConstructorUI } from '@ui';
import { removeIngredient } from '../../services/slices/constructor';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const ctor = useSelector((s) => s.burgerConstructor);
  const orderRequest = useSelector(selectOrderRequest);

  const constructorItems = useMemo(() => {
    const bun = ctor.bun ? { ...ctor.bun, id: ctor.bun.cid } : null;
    const ingredients = ctor.items.map((i) => ({ ...i, id: i.cid }));
    return { bun, ingredients };
  }, [ctor]);

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const onRemoveIngredient = (id: string) => {
    dispatch(removeIngredient(id));
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      onOrderClick={onOrderClick}
      onRemoveIngredient={onRemoveIngredient}
    />
  );
};

export default BurgerConstructor;
