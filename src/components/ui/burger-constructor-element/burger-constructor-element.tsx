import { FC } from 'react';
import { ConstructorElement } from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor-element.module.css';
import { BurgerConstructorElementUIProps } from './type';

export const BurgerConstructorElementUI: FC<
  BurgerConstructorElementUIProps
> = ({
  ingredient,
  index,
  totalItems,
  handleClose,
  handleMoveUp,
  handleMoveDown
}) => (
  <div className={styles.container} data-testid='constructor-ingredient'>
    <div className={styles.controls}>
      <button onClick={handleMoveUp} disabled={index === 0}>
        ↑
      </button>
      <button onClick={handleMoveDown} disabled={index === totalItems - 1}>
        ↓
      </button>
    </div>
    <ConstructorElement
      text={ingredient.name}
      price={ingredient.price}
      thumbnail={ingredient.image}
      handleClose={handleClose}
    />
  </div>
);
