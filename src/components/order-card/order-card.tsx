// src/components/order-card/order-card.tsx
import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredients';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const showStatus = location.pathname.startsWith('/profile/orders');

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // достаём полную инфу по каждому ингредиенту
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], id: string) => {
        const ing = ingredients.find((i) => i._id === id);
        if (ing) acc.push(ing);
        return acc;
      },
      []
    );

    // считаем итоговую стоимость заказа
    const total = ingredientsInfo.reduce((s, v) => s + v.price, 0);

    // для превью в карточке: не больше 6 иконок
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // "+2" и т.п.
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
      showStatus={showStatus}
    />
  );
});
