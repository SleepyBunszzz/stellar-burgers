import { ProfileUI } from '@ui-pages';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUser,
  updateUser,
  selectUser,
  logout
} from '../../services/slices/user';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../../utils/cookie';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [updateUserError, setUpdateUserError] = useState('');
  const initedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser()).catch(() => void 0);
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && !initedRef.current) {
      setFormValue({ name: user.name, email: user.email, password: '' });
      initedRef.current = true;
    }
  }, [user]);

  const isFormChanged = useMemo(() => {
    if (!user) return false;
    return (
      formValue.name !== user.name ||
      formValue.email !== user.email ||
      formValue.password.length > 0
    );
  }, [formValue.name, formValue.email, formValue.password, user]);

  const setName = (value: string) =>
    setFormValue((prev) => ({ ...prev, name: value }));
  const setEmail = (value: string) =>
    setFormValue((prev) => ({ ...prev, email: value }));
  const setPassword = (value: string) =>
    setFormValue((prev) => ({ ...prev, password: value }));

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!isFormChanged || !user) return;

    const payload: Partial<{ name: string; email: string; password: string }> =
      {};
    if (formValue.name !== user.name) payload.name = formValue.name;
    if (formValue.email !== user.email) payload.email = formValue.email;
    if (formValue.password) payload.password = formValue.password;

    try {
      await dispatch(updateUser(payload)).unwrap();

      setUpdateUserError('');
      setFormValue((prev) => ({ ...prev, password: '' }));

      if (payload.password) {
        await dispatch(logout());
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setUpdateUserError('Ошибка обновления пользователя');
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFormValue({ name: user.name, email: user.email, password: '' });
    setUpdateUserError('');
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      setName={setName}
      setEmail={setEmail}
      setPassword={setPassword}
    />
  );
};
