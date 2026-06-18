import { FC } from 'react';
import { FeedInfoUIProps, HalfColumnProps } from './type';
import styles from './feed-info.module.css';

export const FeedInfoUI: FC<FeedInfoUIProps> = ({
  feed,
  readyOrders,
  pendingOrders
}) => (
  <div className={styles.container}>
    <div className={styles.columns}>
      <HalfColumn orders={readyOrders} title='Готовы:' textColor='#00CCCC' />
      <HalfColumn orders={pendingOrders} title='В работе:' />
    </div>
    <div className={styles.total}>
      <p className='text text_type_main-medium'>Выполнено за все время:</p>
      <p className='text text_type_digits-large'>{feed.total}</p>
    </div>
    <div className={styles.totalToday}>
      <p className='text text_type_main-medium'>Выполнено за сегодня:</p>
      <p className='text text_type_digits-large'>{feed.totalToday}</p>
    </div>
  </div>
);

const HalfColumn: FC<HalfColumnProps> = ({ orders, title, textColor }) => (
  <div className={styles.halfColumn}>
    <p className='text text_type_main-medium'>{title}</p>
    <ul className={styles.orderNumbers}>
      {orders.map((number) => (
        <li
          key={number}
          className={`text text_type_digits-default`}
          style={{ color: textColor }}
        >
          {number}
        </li>
      ))}
    </ul>
  </div>
);
