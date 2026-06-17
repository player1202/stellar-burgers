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
  locationState
}) => {
  const { number, name, status, date, total, ingredientsInfo } = orderInfo;

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
    <Link to={`/feed/${number}`} state={locationState} className={styles.link}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.number}>#{number}</span>
          <FormattedDate date={date} className={styles.date} />
        </div>
        <h3 className={styles.name}>{name}</h3>
        <p className={`${styles.status} ${statusColor}`}>{statusText}</p>
        <div className={styles.footer}>
          <div className={styles.ingredients}>
            {Object.values(ingredientsInfo)
              .slice(0, 6)
              .map((item, index) => (
                <div
                  key={item._id}
                  className={styles.ingredientIcon}
                  style={{ zIndex: 6 - index }}
                >
                  <img src={item.image} alt={item.name} />
                  {index === 5 && Object.values(ingredientsInfo).length > 6 && (
                    <span className={styles.extraCount}>
                      +{Object.values(ingredientsInfo).length - 6}
                    </span>
                  )}
                </div>
              ))}
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
