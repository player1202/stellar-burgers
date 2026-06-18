import { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors/ingredients-selectors';
import { TOrder, TIngredient } from '@utils-types';
import { OrderCardUI } from '@ui';

interface OrderCardProps {
  order: TOrder;
}

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const location = useLocation();
  const ingredients = useAppSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
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

    const ingredientsToShow: (TIngredient & { count: number })[] =
      Object.values(ingredientsInfo).slice(0, 6);
    const remains = Object.values(ingredientsInfo).length - 6;

    return {
      ...order,
      ingredientsInfo,
      total,
      date: new Date(order.createdAt),
      ingredientsToShow,
      remains
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return null;
  }

  const basePath = location.pathname.includes('/profile')
    ? '/profile/orders'
    : '/feed';
  const pathname = `${basePath}/${order.number}`;
  const locationState = { background: location };

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      pathname={pathname}
      locationState={locationState}
    />
  );
};
