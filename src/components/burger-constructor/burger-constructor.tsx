import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorReducer';
import { createOrder } from '../../services/slices/orders-slice';
import { selectUser } from '../../services/selectors/user-selectors';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '../ui/burger-constructor';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const bun = useAppSelector((state) => state.constructor?.bun) ?? null;
  const ingredients =
    useAppSelector((state) => state.constructor?.ingredients) ?? [];
  const orderRequest =
    useAppSelector((state) => state.orders?.isLoading) ?? false;
  const orderModalData =
    useAppSelector((state) => state.orders?.currentOrder) ?? null;

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (s: number, v: TConstructorIngredient) => s + v.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
