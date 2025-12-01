// src/components/app/app.tsx
import { useRef, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredients';
import {
  fetchUser,
  setAuthChecked,
  selectAuthChecked
} from '../../services/slices/user';
import { getCookie } from '../../utils/cookie';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { ProtectedRoute } from '../protected-route/protected-route';

import '../../index.css';
import styles from './app.module.css';
import type { Location as RouterLocation } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const ingredients = useSelector(selectIngredients);
  const isAuthChecked = useSelector(selectAuthChecked);

  const didFetchIngredients = useRef(false);
  const didCheckAuth = useRef(false);

  const state = location.state as { background?: RouterLocation } | undefined;

  useEffect(() => {
    if (didFetchIngredients.current) return;
    didFetchIngredients.current = true;
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (didCheckAuth.current) return;
    didCheckAuth.current = true;
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      dispatch(fetchUser());
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  const closeModal = () => {
    if (state?.background) {
      navigate(
        state.background.pathname +
          state.background.search +
          state.background.hash,
        { replace: true }
      );
      return;
    }
    const path = location.pathname;
    if (path.startsWith('/feed/')) {
      navigate('/feed', { replace: true });
    } else if (path.startsWith('/profile/orders/')) {
      navigate('/profile/orders', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  if (!isAuthChecked) {
    return <div className='text text_type_main-medium mt-20'>Загрузка…</div>;
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='' onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
