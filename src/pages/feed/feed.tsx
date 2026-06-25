import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feed-slice';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedIsLoading
} from '../../services/selectors/feed-selectors';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);
  const isLoading = useSelector(selectFeedIsLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      total={total}
      totalToday={totalToday}
      handleGetFeeds={handleGetFeeds}
    />
  );
};
