import styled from 'styled-components';

export const SummaryWrapper = styled.aside`
  width: 100%;
  max-width: 320px;
  padding:20px 0;
  
`;

// export const SummaryTitle = styled.h2`
//   margin: 0 0 12px 0;
//   font-size: 18px;
//   font-weight: 700;
//   color: #151516;
// `;

export const SummaryCard = styled.div`
  border: 1px solid #DDDDDD;
  border-radius: 16px;
  background: #FAFAFA;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const PlanRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 12px;
  height: 64px;
`;

export const PlanIcon = styled.span`
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: #0b65d9;
  color: #fff;
  border-radius: 50%;
  font-size: 16px;

  img {
    width: 16px;
    height: 16px;
    display: block;
  }
`;

export const PlanInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PlanName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #151516;
`;

export const PlanSub = styled.span`
  font-size: 12px;
  color: #727272;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
`;

export const Label = styled.span`
  font-size: 14px;
  color: #727272;
`;

export const Value = styled.span`
  font-size: 14px;
  font-weight: 400;
`;

export const DiscountValue = styled(Value)`
  background: #BFE1AB;
  color: #1A4C00;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 400;
`;

export const CouponButton = styled.button`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 10px 12px;
  border: 1px solid #191847;
  border-radius: 100px;
  background: transparent;
  color: #191847;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 12px 0;
`;

export const TotalRow = styled(Row)`
  margin-top: 4px;
`;

export const TotalValue = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #151516;
`;

export const TotalSub = styled.div`
  font-size: 12px;
  margin-top: 6px;
  width:100%;
  text-align: right;
`;