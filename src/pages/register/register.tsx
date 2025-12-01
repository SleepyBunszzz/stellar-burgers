import { FC, useState } from 'react';
import { useDispatch } from '../../services/store';
import { register } from '../../services/slices/user';
import { RegisterUI } from '../../components/ui/pages/register';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setErrorText('Заполните все поля');
      return;
    }

    dispatch(register({ name, email, password }))
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch((err) =>
        setErrorText(typeof err === 'string' ? err : 'Ошибка регистрации')
      );
  };

  return (
    <RegisterUI
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errorText={errorText}
      handleSubmit={handleSubmit}
    />
  );
};
