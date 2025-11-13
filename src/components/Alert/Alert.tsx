import React from 'react';
import styled from 'styled-components';

const AlertBox = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  background: #FEF3F2; 
  color: #B42318;      
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
`;

const AlertIcon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #D92D20; 
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
`;

const AlertMessage = styled.div`
  font-size: 18px;
  line-height: 1.3;
`;

const AlertClose = styled.button`
  border: none;
  background: transparent;
  color: #1F2937;
  font-size: 20px;
  cursor: pointer;
`;

type AlertProps = {
  message: string;
  onClose: () => void;
};

export const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <AlertBox role="alert" aria-live="assertive">
      <AlertIcon aria-hidden>!</AlertIcon>
      <AlertMessage>{message}</AlertMessage>
      <AlertClose aria-label="Fechar alerta" onClick={onClose}>
        ✕
      </AlertClose>
    </AlertBox>
  );
};

export default Alert;