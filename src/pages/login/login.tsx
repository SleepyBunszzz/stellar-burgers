import { FC, useRef, useState } from 'react';
import { useDispatch } from '../../services/store';
import { login, fetchUser } from '../../services/slices/user';
import { LoginUI } from '../../components/ui/pages/login';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? '/';

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorText('Введите E-mail и пароль');
      return;
    }

    dispatch(login({ email, password }))
      .unwrap()
      .then(async () => {
        await dispatch(fetchUser());
        navigate(from, { replace: true });
      })
      .catch((err) =>
        setErrorText(typeof err === 'string' ? err : 'Ошибка входа')
      );
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
    />
  );
};
