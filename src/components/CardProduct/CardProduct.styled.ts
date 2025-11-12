import styled from 'styled-components';

export const CardWrapper = styled.label<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid ${({ isSelected }) => (isSelected ? '#007bff' : '#e0e0e0')};
  border-radius: 16px;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s ease-in-out;
  margin-bottom: 1rem;
  max-width: 320px;
  min-height: 119px;

  &:hover {
    border-color: #007bff;
  }
`;

export const BestOfferBadge = styled.div`
  position: absolute;
  top: -15px;
  left: 1.5rem;
  background-color: #007bff;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: bold;
`;

export const RadioInput = styled.input`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 20px;
  height: 20px;
`;

export const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
`;

export const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #333;

  span {
    font-size: 1rem;
    font-weight: normal;
    color: #666;
  }
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin: 0;
`;