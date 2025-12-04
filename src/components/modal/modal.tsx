import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals') as HTMLDivElement | null;

export const Modal: FC<TModalProps> = memo(
  ({ title, onClose, children, dataCy }) => {
    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = '';
      };
    }, [onClose]);

    if (!modalRoot) return null;

    return ReactDOM.createPortal(
      <ModalUI title={title} onClose={onClose} dataCy={dataCy}>
        {children}
      </ModalUI>,
      modalRoot
    );
  }
);
