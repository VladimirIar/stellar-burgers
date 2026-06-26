import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
type Props = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth = false }: Props) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const isAuth = !!user;
  if (!isAuthChecked && !onlyUnAuth) {
    return null;
  }
  if (onlyUnAuth && isAuth) {
    return <Navigate to='/' replace />;
  }
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace />;
  }
  return <Outlet />;
};
