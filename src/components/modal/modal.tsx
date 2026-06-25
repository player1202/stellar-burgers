import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div data-testid='modal'>
      <div data-testid='modal-overlay' onClick={onClose} />
      <ModalUI title={title} onClose={onClose}>
        {children}
      </ModalUI>
    </div>,
    modalRoot
  );
});
