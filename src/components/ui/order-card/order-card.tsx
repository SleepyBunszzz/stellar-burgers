// src/components/ui/order-card/order-card.tsx
import { Link, useLocation } from 'react-router-dom';
import type { FC } from 'react';
// 👇 добавь ЭТО: тип Location из react-router-dom с алиасом
import type { Location as RRLocation } from 'react-router-dom';
import { TIngredient } from '@utils-types';

type IngredientThumb = TIngredient;

export type OrderInfoMin = {
  _id: string;
  number: number;
  name: string;
  status: string;
  date: Date;
  ingredientsToShow: IngredientThumb[];
  remains: number;
  total: number;
  ingredientsInfo?: IngredientThumb[];
};

type Props = {
  orderInfo: OrderInfoMin;
  maxIngredients: number;
  showStatus: boolean;
  // 👇 тут меняем RouterLocation -> RRLocation
  locationState?: { background: RRLocation };
};

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
      className='text_color_primary'
      style={{ textDecoration: 'none' }}
    >
      <article
        className='p-6 mb-4'
        style={{ background: '#1C1C21', borderRadius: 24 }}
      >
        <div
          className='mb-4'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span className='text text_type_digits-default'>
            #{orderInfo.number}
          </span>
          <span className='text text_type_main-default'>
            {orderInfo.date.toLocaleString()}
          </span>
        </div>

        <h3 className='text text_type_main-medium mb-4'>{orderInfo.name}</h3>

        <div className='mb-4' style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            {orderInfo.ingredientsToShow.map((i, idx) => (
              <div
                key={i._id ?? idx}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #4C4CFF',
                  marginLeft: idx === 0 ? 0 : -12
                }}
              >
                <img
                  src={i.image}
                  alt={i.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
            {orderInfo.remains > 0 && (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #4C4CFF',
                  marginLeft: orderInfo.ingredientsToShow.length ? -12 : 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#131316'
                }}
              >
                <span className='text text_type_main-default'>
                  +{orderInfo.remains}
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span className='text text_type_digits-default'>
              {orderInfo.total}
            </span>
          </div>
        </div>

        {showStatus && (
          <div className='text text_type_main-default'>{orderInfo.status}</div>
        )}
      </article>
    </Link>
  );
};
