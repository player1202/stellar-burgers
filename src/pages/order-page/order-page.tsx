import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orders-slice';
import { OrderInfo } from '@components';
import { Preloader } from '@ui';

export const OrderPage: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder, isLoading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  if (isLoading || !currentOrder) {
    return <Preloader />;
  }

  return <OrderInfo />;
};
