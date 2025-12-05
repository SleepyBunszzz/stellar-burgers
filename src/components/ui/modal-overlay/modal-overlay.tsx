import { HTMLAttributes } from 'react';
import styles from './modal-overlay.module.css';

type Props = {
  onClick: () => void;
} & HTMLAttributes<HTMLDivElement>;

export const ModalOverlayUI = ({ onClick, ...rest }: Props) => (
  <div
    className={styles.overlay}
    onMouseDown={onClick}
    onClick={onClick}
    {...rest}
  />
);
