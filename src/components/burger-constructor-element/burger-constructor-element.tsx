import { FC } from 'react';
import { useAppDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredient
} from '../../services/slices/constructorReducer';
import { BurgerConstructorElementUI } from '../ui/burger-constructor-element';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = ({
  ingredient,
  index,
  totalItems
}) => {
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(removeIngredient(ingredient.id));
  const handleMoveUp = () =>
    index > 0 && dispatch(moveIngredient(index, index - 1));
  const handleMoveDown = () =>
    index < totalItems - 1 && dispatch(moveIngredient(index, index + 1));

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleClose={handleClose}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
    />
  );
};
