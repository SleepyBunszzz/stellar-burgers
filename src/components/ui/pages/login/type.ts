import { RefObject } from 'react';

export type LoginUIProps = {
  formRef?: RefObject<HTMLFormElement>;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  errorText: string;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  loading?: boolean;
};
