// src/components/app/app.tsx
import React from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate
} from 'react-router-dom';

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

import '../../index.css';
import styles from './app.module.css';

// --- простые гварды на основе localStorage ---
const isAuthed = () => Boolean(localStorage.getItem('token'));

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) =>
  isAuthed() ? <>{children}</> : <Navigate to='/login' replace />;

const OnlyUnAuthRoute: React.FC<React.PropsWithChildren> = ({ children }) =>
  isAuthed() ? <Navigate to='/' replace /> : <>{children}</>;

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { background?: Location } | undefined;
  const closeModal = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={state?.background || location}>
        {/* публичные */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* детальные как полные страницы при прямом переходе */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* только для гостей */}
        <Route
          path='/login'
          element={
            <OnlyUnAuthRoute>
              <Login />
            </OnlyUnAuthRoute>
          }
        />
        <Route
          path='/register'
          element={
            <OnlyUnAuthRoute>
              <Register />
            </OnlyUnAuthRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <OnlyUnAuthRoute>
              <ForgotPassword />
            </OnlyUnAuthRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <OnlyUnAuthRoute>
              <ResetPassword />
            </OnlyUnAuthRoute>
          }
        />

        {/* защищённые */}
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
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
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
              <ProtectedRoute>
                <Modal title='' onClose={closeModal}>
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
