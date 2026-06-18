import { FC, memo } from 'react';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count, onAddClick }) => {
    const handleAdd = () => {
      if (onAddClick) {
        onAddClick(ingredient);
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        handleAdd={handleAdd}
      />
    );
  }
);
