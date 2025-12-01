import { BurgerConstructorElementUI } from '@ui';
import { FC, memo } from 'react';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems, onRemove }) => {
    const handleMoveDown = () => {};
    const handleMoveUp = () => {};

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={onRemove}
      />
    );
  }
);

export default BurgerConstructorElement;
