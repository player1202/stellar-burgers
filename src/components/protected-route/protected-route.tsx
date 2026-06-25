import { ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/selectors/user-selectors';
import { getUser } from '../../services/slices/user-slice';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: TProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(getUser());
    }
  }, [isAuthChecked, dispatch]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
