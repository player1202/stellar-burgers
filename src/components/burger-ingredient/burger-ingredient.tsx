import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count, onAddClick }) => {
    const location = useLocation();

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
        locationState={{ background: location }}
      />
    );
  }
);
