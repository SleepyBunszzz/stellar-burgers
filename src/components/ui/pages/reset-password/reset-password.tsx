import { FC } from 'react';
import {
  PasswordInput,
  Input,
  Button
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';

export type ResetPasswordUIProps = {
  password: string;
  setPassword: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  errorText: string;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
};

export const ResetPasswordUI: FC<ResetPasswordUIProps> = ({
  password,
  setPassword,
  code,
  setCode,
  errorText,
  handleSubmit
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Ввод нового пароля</h3>

      <form
        className={`pb-15 ${styles.form}`}
        name='reset-password'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <PasswordInput
            placeholder='Новый пароль'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name='password'
          />
        </div>

        <div className='pb-6'>
          <Input
            type='text'
            placeholder='Код из письма'
            onChange={(e) => setCode(e.target.value)}
            value={code}
            name='code'
            error={false}
            errorText=''
            size='default'
          />
        </div>

        <div className={`pb-6 ${styles.button}`}>
          <Button type='primary' size='medium' htmlType='submit'>
            Сохранить
          </Button>
        </div>

        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
      </form>

      <div className={`${styles.question} text text_type_main-default`}>
        Вспомнили пароль?
        <Link to={'/login'} className={`pl-2 ${styles.link}`}>
          Войти
        </Link>
      </div>
    </div>
  </main>
);
