import styled from 'styled-components';

export const Hint = styled.p`
  margin: 0  12px 10px 12px ;
  font-size: 14px;
  font-weight: 400;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Item = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 8px;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`;

export const Radio = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
`;

export const ItemTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #151516;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DiscountBadge = styled.span`
  background-color: #9ad68c; /* verde suave */
  color: #0b4c1f;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
`;

export const ItemSub = styled.div`
  font-size: 14px;
  color: #727272;
`;