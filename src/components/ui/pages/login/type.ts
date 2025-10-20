import { Dispatch, SetStateAction, RefObject } from 'react';
import { PageUIProps } from '../common-type';

export type LoginUIProps = PageUIProps & {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  formRef?: RefObject<HTMLFormElement>;
};
