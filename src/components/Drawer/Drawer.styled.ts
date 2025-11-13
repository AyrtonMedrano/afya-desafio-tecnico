import styled from 'styled-components';

export const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity 200ms ease;
  z-index: 999;
`;

export const Panel = styled.aside<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: min(420px, 90vw);
  height: 100vh;
  background: #fff;
  box-shadow: -6px 0 24px rgba(0, 0, 0, 0.12);
  transform: translateX(${(p) => (p.$visible ? '0%' : '100%')});
  transition: transform 240ms ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border-radius: 16px 0 0 16px;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px 20px;
  /* border-bottom: 1px solid #eee; */
`;

export const Title = styled.h2`
  margin:0;
  font-size: 18px;
  font-weight: 600;
`;

export const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  padding: 6px;
`;

export const Content = styled.div`
  padding: 14px 20px 0 20px;
  flex: 1 1 auto;
  overflow-y: auto;
`;

export const Footer = styled.footer`
  padding: 30px 30px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  background: #222;
  color: #fff;
  border: none;
  border-radius: 100px;
  padding: 12px 16px;
  font-weight: 600;
  flex: 1;
  cursor: pointer;

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    background: #DDDDDD;
    color:#B0B0B0
  }
`;

export const SecondaryButton = styled.button`
  background: transparent;
  color: #222;
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: 600;
`;