import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';
import styles from './order-card.module.css';
import { OrderCardUIProps } from './type';

export const OrderCardUI: FC<OrderCardUIProps> = ({
  orderInfo,
  locationState,
  pathname
}) => {
  const { number, name, status, date, total, ingredientsToShow, remains } =
    orderInfo;

  const statusText =
    {
      done: 'Выполнен',
      pending: 'Готовится',
      created: 'Создан',
      cancelled: 'Отменён'
    }[status] || status;

  const statusColor =
    {
      done: styles.done,
      pending: styles.pending,
      created: styles.created,
      cancelled: styles.cancelled
    }[status] || '';

  return (
    <Link to={pathname} state={locationState} className={styles.link}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.number}>#{number}</span>
          <FormattedDate date={date} className={styles.date} />
        </div>
        <h3 className={styles.name}>{name}</h3>
        <p className={`${styles.status} ${statusColor}`}>{statusText}</p>
        <div className={styles.footer}>
          <div className={styles.ingredients}>
            {ingredientsToShow.map((item, index) => (
              <div
                key={item._id}
                className={styles.ingredientIcon}
                style={{ zIndex: 6 - index }}
              >
                <img src={item.image} alt={item.name} />
              </div>
            ))}
            {remains > 0 && <div className={styles.extraCount}>+{remains}</div>}
          </div>
          <div className={styles.price}>
            <span>{total}</span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
      </div>
    </Link>
  );
};
