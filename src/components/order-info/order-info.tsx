// src/components/order-info/order-info.tsx
import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredients';
import {
  fetchOrderByNumber,
  selectCurrentOrder
} from '../../services/slices/orders';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const orderData = useSelector(selectCurrentOrder);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: Record<string, TIngredient & { count: number }>, id: string) => {
        const ing = ingredients.find((i) => i._id === id);
        if (!ing) return acc;
        acc[id] = acc[id]
          ? { ...acc[id], count: acc[id].count + 1 }
          : { ...ing, count: 1 };
        return acc;
      },
      {}
    );

    const values: Array<TIngredient & { count: number }> =
      Object.values(ingredientsInfo);

    const total = values.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
