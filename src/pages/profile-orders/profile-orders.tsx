import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileMenu } from '../../components/profile-menu/profile-menu';
import { Preloader } from '@ui';

import {
  profileFeedStarted,
  profileFeedSuccess,
  profileFeedError,
  profileFeedDisconnected,
  selectProfileFeed
} from '../../services/slices/profile-feed';

import { makeSelectMyOrdersWithDetails } from '../../services/selectors/orders';
import { getCookie } from '../../utils/cookie';
import { Link } from 'react-router-dom';

export const ProfileOrders = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectProfileFeed);
  const selectOrders = useMemo(() => makeSelectMyOrdersWithDetails(), []);
  const orders = useSelector(selectOrders);

  useEffect(() => {
    // пример базового адреса как в твоём Feed
    const apiBase =
      process.env.BURGER_API_URL || 'https://norma.education-services.ru/api';
    const baseWs = apiBase.replace(/^https/, 'wss').replace(/\/api$/, '');

    // токен из cookies; WS ожидает без "Bearer "
    const raw = getCookie('accessToken') || '';
    const token = raw.replace(/^Bearer\s+/i, '');

    const url = `${baseWs}/orders?token=${token}`;

    dispatch(profileFeedStarted());
    const socket = new WebSocket(url);

    socket.onopen = () => {
      /* можно логировать */
    };
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
      } catch {
        // игнор
      }
    };

    return () => socket.close();
  }, [dispatch]);

  return (
    <main
      className='pt-10 pb-10'
      style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 40 }}
    >
      <aside>
        <ProfileMenu />
      </aside>

      <section>
        {feed.loading && orders.length === 0 ? (
          <Preloader />
        ) : orders.length === 0 ? (
          <p className='text text_type_main-default'>Заказов пока нет</p>
        ) : (
          <ul className='flex flex-col gap-4'>
            {orders.map((o) => (
              <li
                key={o._id}
                className='p-6 mb-2'
                style={{ background: '#1C1C21', borderRadius: 12 }}
              >
                <div
                  className='mb-2'
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span className='text text_type_digits-default'>
                    #{o.number}
                  </span>
                  <span className='text'>{o.statusLabel}</span>
                </div>
                <Link
                  className='text text_type_main-default'
                  to={`/profile/orders/${o.number}`}
                >
                  {o.name}
                </Link>
                <div
                  className='mt-4'
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <span className='text text_type_digits-default'>
                    {o.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
