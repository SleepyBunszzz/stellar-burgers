import { FC } from 'react';
import { Button, Input } from '@zlden/react-developer-burger-ui-components';
import styles from './profile.module.css';
import commonStyles from '../common.module.css';

import { ProfileUIProps } from './type';
import { ProfileMenu } from '@components';

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  setName,
  setEmail,
  setPassword
}) => (
  <main className={`${commonStyles.container}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <form
      className={`mt-30 ${styles.form} ${commonStyles.form}`}
      onSubmit={handleSubmit}
    >
      <>
        <div className='pb-6'>
          <Input
            type='text'
            placeholder='Имя'
            onChange={(v: any) =>
              setName(typeof v === 'string' ? v : v?.target?.value ?? '')
            }
            value={formValue.name}
            name='name'
            icon='EditIcon'
          />
        </div>
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='E-mail'
            onChange={(v: any) =>
              setEmail(typeof v === 'string' ? v : v?.target?.value ?? '')
            }
            value={formValue.email}
            name='email'
            icon='EditIcon'
          />
        </div>
        <div className='pb-6'>
          <Input
            type='password'
            placeholder='Пароль'
            onChange={(v: any) =>
              setPassword(typeof v === 'string' ? v : v?.target?.value ?? '')
            }
            value={formValue.password}
            name='password'
            icon='EditIcon'
          />
        </div>

        {isFormChanged && (
          <div className={styles.button}>
            <Button
              type='secondary'
              htmlType='button'
              size='medium'
              onClick={handleCancel}
            >
              Отменить
            </Button>
            <Button type='primary' size='medium' htmlType='submit'>
              Сохранить
            </Button>
          </div>
        )}

        {updateUserError && (
          <p
            className={`${commonStyles.error} pt-5 text text_type_main-default`}
          >
            {updateUserError}
          </p>
        )}
      </>
    </form>
  </main>
);
