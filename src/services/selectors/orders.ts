import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { selectProfileOrders } from '../slices/profile-feed';
import { selectIngredients } from '../slices/ingredients';

const statusMap: Record<string, string> = {
  cancelled: 'Отменён',
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const makeSelectMyOrdersWithDetails = () =>
  createSelector(
    [selectProfileOrders, selectIngredients],
    (orders, ingredients) => {
      const byId = new Map(ingredients.map((i) => [i._id, i]));
      return orders.map((o) => {
        let price = 0;
        const counts: Record<string, number> = {};
        o.ingredients.forEach((id) => (counts[id] = (counts[id] || 0) + 1));

        for (const [id, cnt] of Object.entries(counts)) {
          const ing = byId.get(id);
          if (!ing) continue;
          if (ing.type === 'bun') {
            // булка считается один раз, но *2 половинки
            price += ing.price * 2;
          } else {
            price += ing.price * cnt;
          }
        }

        return {
          ...o,
          price,
          statusLabel: statusMap[o.status] ?? o.status
        };
      });
    }
  );
