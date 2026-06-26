import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { Outlet } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector((state) => state.user.user);
  return (
    <>
      <AppHeaderUI userName={user?.name ?? ''} />
      <Outlet />
    </>
  );
};
