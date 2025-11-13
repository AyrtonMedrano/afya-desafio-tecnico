import type { PropsWithChildren } from 'react';
import {
  Overlay,
  Panel,
  Header,
  Title,
  CloseButton,
  Content,
  Footer,
  PrimaryButton,
  SecondaryButton,
} from './Drawer.styled';

type DrawerProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  role?: string;
};

export function Drawer({
  isOpen,
  title,
  onClose,
  onConfirm,
  confirmDisabled = false,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  role = 'dialog',
  children,
}: PropsWithChildren<DrawerProps>) {
  return (
    <>
      <Overlay $visible={isOpen} onClick={onClose} aria-hidden={!isOpen} />
      <Panel
        $visible={isOpen}
        role={role}
        aria-modal="true"
        aria-label={title ?? 'Seleção'}
      >
        <Header>
          <Title>{title}</Title>
          <CloseButton aria-label="Fechar" onClick={onClose}>
            ✕
          </CloseButton>
        </Header>

        <Content>{children}</Content>

        <Footer>
          
          <PrimaryButton
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            aria-disabled={confirmDisabled}
          >
            {confirmLabel}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onClose}>
            {cancelLabel}
          </SecondaryButton>
        </Footer>
      </Panel>
    </>
  );
}