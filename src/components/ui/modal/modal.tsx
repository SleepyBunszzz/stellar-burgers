import { FC, memo } from 'react';
import styles from './modal.module.css';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children, dataCy }) => (
    <>
      <div
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        data-cy={dataCy ?? 'modal'} // контейнер модалки (например, "ingredient-modal")
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={`${styles.title} text text_type_main-large`}>
            {title}
          </h3>
          <button
            className={styles.button}
            type='button'
            aria-label='Закрыть'
            data-cy='modal-close' // крестик
            onClick={onClose}
          >
            <CloseIcon type='primary' />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>

      {/* полупрозрачный фон модалки */}
      <ModalOverlayUI onClick={onClose} data-cy='modal-overlay' />
    </>
  )
);
