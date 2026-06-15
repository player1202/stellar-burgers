import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { useAppSelector } from '../../services/store';
import { selectUser } from '../../services/selectors/user-selectors';

export const AppHeader: FC = () => {
  const location = useLocation();
  const user = useAppSelector(selectUser);

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname === '/feed';
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <header
      style={{
        background: '#1C1C21',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <nav
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px'
        }}
      >
        <div style={{ display: 'flex', gap: '40px' }}>
          <Link
            to='/'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: isConstructorActive ? '#F2F2F3' : '#8585AD'
            }}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <span style={{ fontSize: '16px' }}>Конструктор</span>
          </Link>
          <Link
            to='/feed'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: isFeedActive ? '#F2F2F3' : '#8585AD'
            }}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <span style={{ fontSize: '16px' }}>Лента заказов</span>
          </Link>
        </div>
        <div>
          <Link to='/' style={{ display: 'flex', alignItems: 'center' }}>
            <Logo className='' />
          </Link>
        </div>
        <div>
          <Link
            to='/profile'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: isProfileActive ? '#F2F2F3' : '#8585AD'
            }}
          >
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <span style={{ fontSize: '16px' }}>
              {user?.name || 'Личный кабинет'}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};
