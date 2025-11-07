import { Link, useLocation } from 'react-router-dom';
import type { FC } from 'react';
import type { Location as RRLocation } from 'react-router-dom';
import { CurrencyIcon } from '@zlden/react-developer-burger-ui-components';
import { OrderStatus } from '@components';
import { TIngredient } from '@utils-types';

// используем стили страницы, чтобы совпасть с макетом
import pageStyles from '../pages/profile-orders/profile-orders.module.css';

type IngredientThumb = TIngredient;

export type OrderInfoMin = {
  _id: string;
  number: number;
  name: string;
  status: string;
  date: Date;
  ingredientsToShow: IngredientThumb[]; // первые N
  remains: number; // сколько поверх N
  total: number;
  ingredientsInfo?: IngredientThumb[];
};

type Props = {
  orderInfo: OrderInfoMin;
  maxIngredients: number;
  showStatus: boolean; // true => профиль (/profile/orders), false => лента (/feed)
  locationState?: { background: RRLocation };
};

function formatOrderDate(d: Date) {
  const now = new Date();
  const isSame = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');

  let prefix = '';
  if (isSame(d, now)) prefix = 'Сегодня';
  else if (isSame(d, yesterday)) prefix = 'Вчера';
  else {
    const diff = Math.floor((+now - +d) / 86400000);
    const n10 = diff % 10;
    const n100 = diff % 100;
    const form =
      n10 === 1 && n100 !== 11
        ? 'день'
        : n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)
          ? 'дня'
          : 'дней';
    prefix = `${diff} ${form} назад`;
  }

  return `${prefix}, ${hh}:${mm} i-GMT+3`;
}

export const OrderCardUI: FC<Props> = ({
  orderInfo,
  showStatus,
  locationState
}) => {
  const location = useLocation();

  const to = showStatus
    ? `/profile/orders/${orderInfo.number}`
    : `/feed/${orderInfo.number}`;

  return (
    <Link
      to={to}
      state={locationState ?? { background: location }}
      className={pageStyles.title}
    >
      <div className={pageStyles.cardHeader}>
        <span className={`text text_type_digits-default ${pageStyles.number}`}>
          #{orderInfo.number}
        </span>
        <span className={`text text_type_main-default ${pageStyles.date}`}>
          {formatOrderDate(orderInfo.date)}
        </span>
      </div>
      <div className={pageStyles.cardBody}>
        <h3 className='text text_type_main-medium'>{orderInfo.name}</h3>
        {showStatus && (
          <div className='mt-2'>
            <OrderStatus status={orderInfo.status as any} />
          </div>
        )}
      </div>
      <div className={pageStyles.cardFooter}>
        <div className={pageStyles.ingRow}>
          {orderInfo.ingredientsToShow.map((i, idx) => (
            <div
              key={`${i._id ?? 'unknown'}-${idx}`}
              className={pageStyles.ingWrap}
              style={{ zIndex: 6 - idx, marginLeft: idx === 0 ? 0 : -12 }}
            >
              <img
                className={pageStyles.ingImg}
                src={i.image_mobile ?? i.image}
                alt={i.name}
              />
            </div>
          ))}
          {orderInfo.remains > 0 && (
            <div
              className={`${pageStyles.ingWrap} ${pageStyles.ingMore}`}
              style={{ marginLeft: -12 }}
            >
              <span className='text text_type_main-default'>
                +{orderInfo.remains}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className='text text_type_digits-default'>
            {orderInfo.total}
          </span>
          <CurrencyIcon type='primary' />
        </div>
      </div>
    </Link>
  );
};
