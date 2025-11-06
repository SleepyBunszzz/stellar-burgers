import { FC, memo } from 'react';
import pageStyles from '../pages/profile-orders/profile-orders.module.css';
import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = memo(({ orderByDate }) => (
  <ul className={pageStyles.list}>
    {orderByDate.map((order) => (
      <li key={order._id} className={pageStyles.card}>
        <OrderCard order={order} />
      </li>
    ))}
  </ul>
));
