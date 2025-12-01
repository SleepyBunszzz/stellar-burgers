import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import {
  selectFeedOrders,
  selectFeedLoading,
  feedLoadingStarted,
  feedLoadingSuccess,
  feedDisconnected
} from '../../services/slices/feed';
import { URL } from '../../utils/burger-api';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);

  useEffect(() => {
    const apiBase = URL;
    const WS_URL =
      apiBase.replace(/^http/, 'ws').replace(/\/api$/, '') + '/orders/all';

    dispatch(feedLoadingStarted());

    const socket = new WebSocket(WS_URL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.orders) {
        dispatch(
          feedLoadingSuccess({
            orders: data.orders,
            total: data.total,
            totalToday: data.totalToday
          })
        );
      }
    };

    return () => {
      socket.close();
      dispatch(feedDisconnected());
    };
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} />;
};
