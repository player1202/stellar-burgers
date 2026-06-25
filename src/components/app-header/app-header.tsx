import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { selectUser } from '../../services/selectors/user-selectors';

export const AppHeader: FC = () => {
  const user = useAppSelector(selectUser);
  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
