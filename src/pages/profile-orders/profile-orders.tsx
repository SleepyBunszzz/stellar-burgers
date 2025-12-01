import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileOrdersUI } from '../../components/ui/pages/profile-orders/profile-orders';
import {
  profileFeedStarted,
  profileFeedSuccess,
  profileFeedError,
  profileFeedDisconnected,
  selectProfileFeed
} from '../../services/slices/profile-feed';
import { getCookie } from '../../utils/cookie';
import { URL } from '../../utils/burger-api';

const buildWsUrl = (origin: string, token: string) => {
  const clean = origin.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  const wsOrigin = clean.replace(/^http(s?):/, 'ws$1:');
  return `${wsOrigin}/orders?token=${encodeURIComponent(token)}`;
};

const extractAccessToken = () => {
  const raw = getCookie('accessToken') || '';
  return raw
    .replace(/^Bearer\s+/i, '')
    .replace(/^"+|"+$/g, '')
    .trim();
};

export const ProfileOrders = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectProfileFeed);

  const ordersSorted = useMemo(() => {
    const arr = feed.orders ?? [];
    return [...arr].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [feed.orders]);

  useEffect(() => {
    const apiBase = URL;
    const token = extractAccessToken();
    if (!token) return;

    const wsUrl = buildWsUrl(apiBase, token);

    dispatch(profileFeedStarted());
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {};
    socket.onerror = () => dispatch(profileFeedError('WS error'));
    socket.onclose = () => dispatch(profileFeedDisconnected());
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.orders) {
          dispatch(
            profileFeedSuccess({
              orders: data.orders,
              total: data.total ?? 0,
              totalToday: data.totalToday ?? 0
            })
          );
        }
      } catch {}
    };

    return () => socket.close();
  }, [dispatch]);

  return <ProfileOrdersUI orders={ordersSorted} />;
};

export default ProfileOrders;
