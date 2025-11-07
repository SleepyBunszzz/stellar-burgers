import { FC } from 'react';
import {
  ConstructorElement,
  DragIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from '../ui/burger-constructor-element/burger-constructor-element.module.css';
import { TConstructorItemUI } from '../ui/burger-constructor/type';

type Props = {
  ingredient: TConstructorItemUI;
  index: number;
  totalItems: number;
  onRemove: () => void;
};

export const BurgerConstructorElement: FC<Props> = ({
  ingredient,
  onRemove
}) => (
  <li className={styles.item}>
    <DragIcon type='primary' />
    <ConstructorElement
      text={ingredient.name}
      price={ingredient.price}
      thumbnail={ingredient.image}
      handleClose={onRemove}
    />
  </li>
);

export default BurgerConstructorElement;
