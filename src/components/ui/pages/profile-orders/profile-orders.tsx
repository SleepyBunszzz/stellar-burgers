import { FC } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => (
  <main className={styles.main}>
    <div className={`${styles.menu}`}>
      <ProfileMenu />
    </div>

    <div className={styles.orders}>
      <div className={styles.scroller}>
        <OrdersList orders={orders} />
      </div>
    </div>
  </main>
);
