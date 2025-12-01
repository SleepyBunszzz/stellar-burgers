import { FC, memo } from 'react';
import styles from './feed.module.css';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';

export const FeedUI: FC<FeedUIProps> = memo(({ orders }) => (
  <main className={styles.containerMain}>
    <div className={`${styles.titleBox} mt-10 mb-5`}>
      <h1 className='text text_type_main-large'>Лента заказов</h1>
    </div>

    <div className={styles.main}>
      <section className={styles.columnOrders}>
        <OrdersList orders={orders} />
      </section>
      <aside className={styles.columnInfo}>
        <FeedInfo />
      </aside>
    </div>
  </main>
));
