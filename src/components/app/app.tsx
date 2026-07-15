import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
// import '../../index.css';
import styles from './app.module.css';
import { redirect, Route, Routes, useNavigate } from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useEffect } from 'react';
import { checkUserAuth } from '../../services/slices/userSlice';
import { OrderModal } from '../order-modal';
console.log('APP');
const App = () => {
  const dispatch = useDispatch();
  const { isIngredientsLoading } = useSelector((state) => state.ingredients);
  const { isAuthChecked } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, []);
  const navigate = useNavigate();

  if (!isAuthChecked || isIngredientsLoading) {
    return <Preloader />;
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<AppHeader />}>
          <Route index element={<ConstructorPage />} />
          <Route path='feed' element={<Feed />} />
          <Route
            path='feed/:number'
            element={
              <Modal title='' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='ingredients/:id'
            element={
              <Modal title='Детали ингридиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute onlyUnAuth />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path='profile' element={<Profile />} />
            <Route path='profile/orders' element={<ProfileOrders />} />
            <Route
              path='profile/orders/:number'
              element={<OrderModal onClose={() => navigate(-1)} />}
            />
          </Route>
          <Route path='*' element={<NotFound404 />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
