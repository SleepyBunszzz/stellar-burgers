// src/pages/constructor-page/constructor-page.tsx
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients, BurgerConstructor, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

import {
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/slices/ingredients';

import {
  selectCurrentOrder,
  selectOrderRequest,
  clearCurrentOrder
} from '../../services/slices/orders';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  const currentOrder = useSelector(selectCurrentOrder);
  const orderRequest = useSelector(selectOrderRequest);

  const closeOrderModal = () => dispatch(clearCurrentOrder());

  if (isIngredientsLoading) return <Preloader />;

  if (ingredientsError) {
    return (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Соберите бургер
        </h1>
        <div className={`${styles.main} pl-5 pr-5`}>
          <p className='text text_type_main-default text_color_inactive'>
            Ошибка загрузки ингредиентов: {ingredientsError}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>

      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>

      {orderRequest && (
        <Modal title='Оформляем заказ...' onClose={closeOrderModal}>
          <Preloader />
        </Modal>
      )}

      {currentOrder && !orderRequest && (
        <Modal title='' onClose={closeOrderModal}>
          <OrderDetailsUI orderNumber={currentOrder.number} />
        </Modal>
      )}
    </main>
  );
};

export default ConstructorPage;
