import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orders-slice';
import { OrderInfo } from '@components';
import { Preloader } from '@ui';
import { selectIngredients } from '../../services/selectors/ingredients-selectors';

export const OrderPage: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder, isLoading } = useAppSelector((state) => state.orders);
  const ingredients = useAppSelector(selectIngredients);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!currentOrder) return null;

    const ingredientsWithCount = currentOrder.ingredients.reduce(
      (acc: any, id: string) => {
        const ingredient = ingredients.find((item) => item._id === id);
        if (ingredient) {
          if (!acc[id]) {
            acc[id] = { ...ingredient, count: 0 };
          }
          acc[id].count += 1;
        }
        return acc;
      },
      {}
    );

    const total = currentOrder.ingredients.reduce((sum: number, id: string) => {
      const ingredient = ingredients.find((item) => item._id === id);
      return sum + (ingredient?.price || 0);
    }, 0);

    return {
      ...currentOrder,
      ingredientsInfo: ingredientsWithCount,
      total,
      date: new Date(currentOrder.createdAt)
    };
  }, [currentOrder, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfo order={orderInfo} />;
};
