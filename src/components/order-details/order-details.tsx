import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectCurrentOrder } from '../../services/slices/orders';

export const OrderDetails: FC = () => {
  const order = useSelector(selectCurrentOrder);
  if (!order) return null;
  return (
    <div style={{ textAlign: 'center' }}>
      <p className='text text_type_digits-large mb-8'>{order.number}</p>
      <p className='text text_type_main-medium mb-15'>идентификатор заказа</p>
      <p className='text text_type_main-default mt-2'>
        Ваш заказ начали готовить
      </p>
      <p className='text text_type_main-default text_color_inactive'>
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
