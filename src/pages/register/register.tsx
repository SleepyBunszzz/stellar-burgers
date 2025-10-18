import { FC, SyntheticEvent, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RegisterUI } from '@ui-pages';
import {
  register,
  selectUserLoading,
  selectUser
} from '../../services/slices/user';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../../services/store';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const loading = useSelector(selectUserLoading);
  const user = useSelector(selectUser);
  const error = useSelector((s: RootState) => s.user.error);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = useMemo(() => {
    const okEmail = /\S+@\S+\.\S+/.test(email);
    const okName = userName.trim().length >= 2;
    const okPass = password.length >= 6;
    return okEmail && okName && okPass;
  }, [email, userName, password]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    try {
      await dispatch(register({ email, name: userName, password })).unwrap();
    } catch {}
  };

  if (user) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <RegisterUI
      errorText={error || undefined}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
