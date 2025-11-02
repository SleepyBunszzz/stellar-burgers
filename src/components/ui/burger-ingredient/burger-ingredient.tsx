import { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import {
  Counter,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd }) => {
    const { image, price, name, _id } = ingredient;
    const location = useLocation();

    return (
      <li className={styles.container}>
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={{ background: location }}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {count > 0 && <Counter count={count} />}
          <img className={styles.img} src={image} alt={name} />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>

        <button
          type='button'
          className={`text text_type_main-default ${styles.addLink}`}
          onClick={() => handleAdd(ingredient)}
        >
          Добавить
        </button>
      </li>
    );
  }
);
