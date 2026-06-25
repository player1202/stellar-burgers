import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orders-slice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { selectIngredients } from '../../services/selectors/ingredients-selectors';
import { TIngredient } from '@utils-types';

interface OrderInfoProps {
  order?: any;
}

export const OrderInfo: FC<OrderInfoProps> = ({ order: propOrder }) => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder, isLoading } = useAppSelector((state) => state.orders);
  const ingredients = useAppSelector(selectIngredients);

  useEffect(() => {
    if (number && !propOrder) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, propOrder]);

  const orderData = propOrder || currentOrder;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce((acc: number, item) => {
      const ingredient = item as TIngredient & { count: number };
      return acc + ingredient.price * ingredient.count;
    }, 0);

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
