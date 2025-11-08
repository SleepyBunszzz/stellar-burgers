import React, { FC, memo } from 'react';
import styles from './burger-constructor-element.module.css';

/**
 * Презентационный компонент.
 * НИКАКОГО redux, только рендер и вызов колбэков из пропсов.
 * Контейнер с диспатчами — в «не-ui» слое.
 */
export type BurgerConstructorElementUIProps = {
  ingredient: {
    id: string; // cid/uuid элемента в конструкторе
    name: string;
    price: number;
    image: string;
  };
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
};

export const BurgerConstructorElementUI: FC<BurgerConstructorElementUIProps> =
  memo(
    ({
      ingredient,
      index,
      totalItems,
      handleMoveUp,
      handleMoveDown,
      handleClose
    }) => (
      <li className={styles.element}>
        {/* левая часть — картинка/название (примерный скелет; подставь свои UI-компоненты) */}
        <div className={styles.element_fullwidth}>
          <div className='mb-2'>
            <img
              src={ingredient.image}
              alt={ingredient.name}
              width={48}
              height={48}
            />
          </div>
          <div className='text text_type_main-default'>{ingredient.name}</div>
        </div>

        {/* управление порядком */}
        <div className='ml-4 mr-2'>
          <button
            type='button'
            aria-label='Переместить выше'
            onClick={handleMoveUp}
            disabled={index <= 0}
          >
            ↑
          </button>
          <button
            type='button'
            aria-label='Переместить ниже'
            onClick={handleMoveDown}
            disabled={index >= totalItems - 1}
          >
            ↓
          </button>
        </div>

        {/* цена и крестик закрытия */}
        <div className={styles.element}>
          <span className='text text_type_digits-default mr-2'>
            {ingredient.price}
          </span>
          <button type='button' aria-label='Удалить' onClick={handleClose}>
            ✕
          </button>
        </div>
      </li>
    )
  );
