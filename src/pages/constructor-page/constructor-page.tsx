import { FC } from 'react';
import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';

import {
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/slices/ingredients';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

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
    </main>
  );
};
