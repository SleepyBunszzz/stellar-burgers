import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/user';
import { clearConstructor } from '../../services/slices/constructor';
import { createOrder, selectOrderRequest } from '../../services/slices/orders';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';

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
    // по желанию можно очищать конструктор после успешного заказа в extraReducer createOrder.fulfilled
    // или здесь через .unwrap().then(() => dispatch(clearConstructor()))
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest} // можно оставить, если UI что-то визуально блокирует
      constructorItems={constructorItems}
      onOrderClick={onOrderClick}
    />
  );
};

export default BurgerConstructor;
