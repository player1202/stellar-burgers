import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/selectors/feed-selectors';
import { FeedInfoUI } from '@ui';

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);

  const { readyOrders, pendingOrders } = useMemo(() => {
    const ready: number[] = [];
    const pending: number[] = [];

    orders.forEach((order) => {
      if (order.status === 'done') {
        ready.push(order.number);
      } else if (order.status === 'pending' || order.status === 'created') {
        pending.push(order.number);
      }
    });

    return {
      readyOrders: ready.slice(0, 10),
      pendingOrders: pending.slice(0, 10)
    };
  }, [orders]);

  const feed = {
    total,
    totalToday
  };

  return (
    <FeedInfoUI
      feed={feed}
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};
