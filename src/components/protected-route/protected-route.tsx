import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from '../../services/store';
type Props = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth = false }: Props) => {
  const { user } = useSelector((state) => state.user);
  const isAuth = !!user;

  if (onlyUnAuth && isAuth) {
    return <Navigate to='/' replace />;
  }
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace />;
  }
  return <Outlet />;
};
