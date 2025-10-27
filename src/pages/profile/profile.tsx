import { ProfileUI } from '@ui-pages';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser, updateUser, selectUser } from '../../services/slices/user';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // локальная форма для имени/email/пароля
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [updateUserError, setUpdateUserError] = useState('');
  const initedRef = useRef(false); // чтобы один раз заполнить форму из user

  // (1) при монтировании, если user пустой, пытаемся его подтянуть с бэка
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser()).catch(() => void 0);
    }
  }, [dispatch, user]);

  // (2) когда user появился — один раз кладём name/email в форму
  useEffect(() => {
    if (user && !initedRef.current) {
      setFormValue({ name: user.name, email: user.email, password: '' });
      initedRef.current = true;
    }
  }, [user]);

  // (3) вычисляем, есть ли отличия от исходных данных
  const isFormChanged = useMemo(() => {
    if (!user) return false;
    return (
      formValue.name !== user.name ||
      formValue.email !== user.email ||
      formValue.password.length > 0
    );
  }, [formValue.name, formValue.email, formValue.password, user]);

  // сеттеры полей формы
  const setName = (value: string) =>
    setFormValue((prev) => ({ ...prev, name: value }));
  const setEmail = (value: string) =>
    setFormValue((prev) => ({ ...prev, email: value }));
  const setPassword = (value: string) =>
    setFormValue((prev) => ({ ...prev, password: value }));

  // (4) сабмит формы — шлём patch /auth/user через updateUser thunk
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
    } catch (err) {
      setUpdateUserError('Ошибка обновления пользователя');
    }
  };

  // (5) сбросить изменения
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
