import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { selectFeedOrders, selectFeedTotals } from '../../services/slices/feed';

const getOrdersByStatus = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const { total, totalToday } = useSelector(selectFeedTotals);

  const readyOrders = useMemo(
    () => getOrdersByStatus(orders, 'done'),
    [orders]
  );

  const pendingOrders = useMemo(
    () => getOrdersByStatus(orders, 'pending'),
    [orders]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
