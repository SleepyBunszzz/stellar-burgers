import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps, TConstructorItemUI } from './type';
import { BurgerConstructorElement } from '@components';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  onOrderClick,
  onRemoveIngredient
}) => (
  <section className={styles.burger_constructor}>
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mb-4 mr-4`}
        data-cy='constructor-bun-1'
      >
        <ConstructorElement
          type='top'
          isLocked
          text={`${constructorItems.bun.name} (верх)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        Выберите булки
      </div>
    )}

    <ul className={styles.elements} data-cy='constructor-ingredients'>
      {constructorItems.ingredients.length > 0 ? (
        constructorItems.ingredients.map(
          (item: TConstructorItemUI, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.cid}
              onRemove={() => onRemoveIngredient(item.cid)}
            />
          )
        )
      ) : (
        <li
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          role='presentation'
        >
          Выберите начинку
        </li>
      )}
    </ul>

    {constructorItems.bun ? (
      <div
        className={`${styles.element} mt-4 mr-4`}
        data-cy='constructor-bun-2'
      >
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${constructorItems.bun.name} (низ)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        Выберите булки
      </div>
    )}

    <div className={`${styles.total} mt-10 mr-4`}>
      <div className={`${styles.cost} mr-10`}>
        <p className={`text ${styles.text} mr-2`}>{price}</p>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        onClick={onOrderClick}
        disabled={
          orderRequest ||
          !constructorItems.bun ||
          constructorItems.ingredients.length === 0
        }
      >
        Оформить заказ
      </Button>
    </div>
  </section>
);
