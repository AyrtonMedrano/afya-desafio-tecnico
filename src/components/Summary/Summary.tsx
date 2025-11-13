import React from 'react';
import {
    SummaryWrapper,
    SummaryCard,
    PlanRow,
    PlanIcon,
    PlanInfo,
    PlanName,
    PlanSub,
    Row,
    Label,
    Value,
    DiscountValue,
    CouponButton,
    Divider,
    TotalRow,
    TotalValue,
    TotalSub,
} from './Summary.styled';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import crown from '../../assets/crown.svg';
import tag from '../../assets/tag.svg';

export const Summary: React.FC = () => {
    const {
        selectedPlan,
        installments,
        calculateSubtotal,
        calculateDiscount,
        calculateTotal,
    } = useCheckoutStore();

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const total = calculateTotal();

    const formatBRL = (v: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    const perInstallment = (installments > 0 ? Math.round((total / installments) * 100) / 100 : 0);

    return (
        // Usa data-tag-src para evitar warning de import não usado por enquanto
        <SummaryWrapper data-tag-src={tag}>

            <SummaryCard>
                <PlanRow>
                    <PlanIcon aria-hidden>
                        <img src={crown} alt="Icone de uma coroa branca em fundo azul" />
                    </PlanIcon>
                    <PlanInfo>
                        <PlanName>Conteúdos Premium</PlanName>
                        <PlanSub>Renovação {selectedPlan === 'anual' ? 'anual' : 'mensal'}</PlanSub>
                    </PlanInfo>
                </PlanRow>

                <Row>
                    <Label>Pagamento</Label>
                    <Value>Cartão de crédito</Value>
                </Row>

                <Row>
                    <Label>Subtotal</Label>
                    <Value>{formatBRL(subtotal)}</Value>
                </Row>
                {/* {discount && ( */}
                    <Row>
                        <Label>Desconto – 10%</Label>
                        <DiscountValue>
                            {discount > 0 ? `– ${formatBRL(discount)}` : formatBRL(0)}
                        </DiscountValue>
                    </Row>
                {/* )} */}


                <CouponButton type="button" aria-label="Tem um cupom de desconto?">
                        <img src={tag} alt="Icone de uma etiqueta desenhada em cor roxa" />

                    Tem um cupom de desconto?
                </CouponButton>

                <Divider />

                <TotalRow>
                    <Label>Total</Label>
                    <TotalValue>{formatBRL(total)}</TotalValue>
                </TotalRow>
                <TotalSub>
                    {installments}x de {formatBRL(perInstallment)}
                    <br />Sem juros no cartão
                </TotalSub>
            </SummaryCard>
        </SummaryWrapper>
    );
};

export default Summary;