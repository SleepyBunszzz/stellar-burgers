import React, { FC, memo } from 'react';
import styles from './ingredient-details.module.css';
import { IngredientDetailsUIProps } from './type';

export const IngredientDetailsUI: FC<IngredientDetailsUIProps> = memo(
  ({ ingredientData }) => {
    const { name, image_large, calories, proteins, fat, carbohydrates } =
      ingredientData;

    const formatValue = (raw: number | string): string => {
      let num =
        typeof raw === 'number'
          ? raw
          : Number(String(raw).replace(',', '.').trim());
      if (!Number.isFinite(num)) return String(raw);
      if (num >= 1000 && num % 10 === 0) {
        num = num / 10;
      }
      return num.toLocaleString('ru-RU', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      });
    };

    return (
      <div className={styles.content}>
        <img
          className={styles.img}
          alt='изображение ингредиента'
          src={image_large}
        />
        <h3 className='text text_type_main-medium mt-2 mb-4'>{name}</h3>
        <ul className={`${styles.nutritional_values} text_type_main-default`}>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Калории, ккал</p>
            <p className='text text_type_digits-default'>
              {formatValue(calories)}
            </p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Белки, г</p>
            <p className='text text_type_digits-default'>
              {formatValue(proteins)}
            </p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Жиры, г</p>
            <p className='text text_type_digits-default'>{formatValue(fat)}</p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Углеводы, г</p>
            <p className='text text_type_digits-default'>
              {formatValue(carbohydrates)}
            </p>
          </li>
        </ul>
      </div>
    );
  }
);
