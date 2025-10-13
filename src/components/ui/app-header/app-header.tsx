import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './app-header.module.css';

type AppHeaderProps = { userName?: string };

export const AppHeader: React.FC<AppHeaderProps> = ({ userName }) => {
  const profileDeepActive = !!useMatch('/profile/*');
  const feedDeepActive = !!useMatch('/feed/*');

  // возвращаем типографику + паддинги, не меняя модульные стили
  const linkClass = (active: boolean) =>
    `${styles.link} text text_type_main-default pt-4 pr-5 pb-4 pl-5 ${active ? styles.link_active : ''}`;

  return (
    <header className={styles.header}>
      {/* вернули общий внутренний отступ у меню */}
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to='/' end className={({ isActive }) => linkClass(isActive)}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='ml-2'>Конструктор</span>
              </>
            )}
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) => linkClass(isActive || feedDeepActive)}
          >
            {({ isActive }) => {
              const active = isActive || feedDeepActive;
              return (
                <>
                  <ListIcon type={active ? 'primary' : 'secondary'} />
                  <span className='ml-2'>Лента заказов</span>
                </>
              );
            }}
          </NavLink>
        </div>

        {/* Лого оставляем нейтральным, но у Logo обязателен className */}
        <NavLink to='/' className={styles.logo} aria-label='На главную'>
          <Logo className={styles.logo} />
        </NavLink>

        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              linkClass(isActive || profileDeepActive)
            }
          >
            {({ isActive }) => {
              const active = isActive || profileDeepActive;
              return (
                <>
                  <ProfileIcon type={active ? 'primary' : 'secondary'} />
                  <span className='ml-2'>{userName || 'Личный кабинет'}</span>
                </>
              );
            }}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
