import { ReactNode } from 'react';

export type TModalUIProps = {
  title: string;
  onClose: () => void;
  children?: ReactNode;
  /** data-cy для корневого контейнера модалки (например, "ingredient-modal") */
  dataCy?: string;
};
