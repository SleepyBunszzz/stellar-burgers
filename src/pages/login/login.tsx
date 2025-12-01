import { FC, useRef, useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { login, selectUserLoading } from '../../services/slices/user';
import { LoginUI } from '../../components/ui/pages/login/login';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectUserLoading);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const formRef = useRef<HTMLFormElement | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText('');

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => navigate(from, { replace: true }))
      .catch(() => setErrorText('Неверный e-mail или пароль'));
  };

  return (
    <LoginUI
      formRef={formRef}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errorText={errorText}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default Login;
