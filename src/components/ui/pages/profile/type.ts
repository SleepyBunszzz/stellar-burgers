import { SyntheticEvent } from 'react';

export type ProfileUIProps = {
  formValue: {
    name: string;
    email: string;
    password: string;
  };
  isFormChanged: boolean;

  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleCancel: (e: SyntheticEvent) => void;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  updateUserError?: string;
};
