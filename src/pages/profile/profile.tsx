import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser, updateUser, selectUser } from '../../services/slices/user';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  // useEffect(() => {
  //   dispatch(fetchUser());
  // }, [dispatch]);

  const isFormChanged = useMemo(() => {
    if (!user) return false;
    return (
      formValue.name !== user.name ||
      formValue.email !== user.email ||
      !!formValue.password
    );
  }, [formValue.name, formValue.email, formValue.password, user]);

  useEffect(() => {
    if (user && !isFormChanged) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user, isFormChanged]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged || !user) return;

    const payload: Partial<{ name: string; email: string; password: string }> =
      {};
    if (formValue.name !== user.name) payload.name = formValue.name;
    if (formValue.email !== user.email) payload.email = formValue.email;
    if (formValue.password) payload.password = formValue.password;

    try {
      await dispatch(updateUser(payload)).unwrap();
      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch {}
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
