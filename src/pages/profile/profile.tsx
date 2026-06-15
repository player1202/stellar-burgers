import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  selectUser,
  selectUserIsLoading,
  selectUserError
} from '../../services/selectors/user-selectors';
import {
  updateUser,
  logoutUser,
  getUser
} from '../../services/slices/user-slice';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectUserIsLoading);
  const updateUserError = useAppSelector(selectUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    } else {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [dispatch, user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const updateData: any = {};
    if (formValue.name !== user?.name) updateData.name = formValue.name;
    if (formValue.email !== user?.email) updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    if (Object.keys(updateData).length === 0) return;

    await dispatch(updateUser(updateData));
    setFormValue((prev) => ({ ...prev, password: '' }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  if (isLoading && !user) {
    return <div>Загрузка...</div>;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleLogout={handleLogout}
      updateUserError={updateUserError || undefined}
    />
  );
};
