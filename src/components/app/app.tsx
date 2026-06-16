import { useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  IngredientPage,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
  OrderPage
} from '@pages';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Modal, IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { getUser, setAuthChecked } from '../../services/slices/user-slice';
import {
  selectIsLoading,
  selectError
} from '../../services/selectors/ingredients-selectors';
import { selectIsAuthChecked } from '../../services/selectors/user-selectors';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);

  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchIngredients());

    const accessToken = getCookie('accessToken');
    if (accessToken && !isAuthChecked) {
      dispatch(getUser());
    } else if (!accessToken && !isAuthChecked) {
      dispatch(setAuthChecked());
    }
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          Ошибка: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderPage />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Детали заказа' onClose={handleClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
