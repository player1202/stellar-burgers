import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementUIProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  handleClose: () => void;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
};
