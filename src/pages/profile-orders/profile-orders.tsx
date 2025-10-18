import { ProfileMenu } from '../../components/profile-menu/profile-menu';

export const ProfileOrders = () => (
  <main
    className='pt-10 pb-10'
    style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 40 }}
  >
    <aside>
      <ProfileMenu />
    </aside>
    <section>
      <p className='text text_type_main-default'>История заказов будет здесь</p>
    </section>
  </main>
);
