import { useEffect, useState } from 'react';
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
    CouponBox,
    CouponLabel,
    CouponInput,
    CouponActions,
    CouponCancel,
    CouponApply,
    CouponError,
    CouponSuccess,
    CouponSuccessTop,
    CouponSuccessRemove,
} from './Summary.styled';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import crown from '../../assets/crown.svg';
import tag from '../../assets/tag.svg';
import { getCoupons, validateCoupon } from '../../services/api';

export const Summary: React.FC = () => {
    const {
        selectedPlan,
        installments,
        calculateSubtotal,
        calculateTotal,
        couponCode,
        couponPercent,
        setCouponCode,
        applyCoupon,
        clearCoupon,
    } = useCheckoutStore();
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [loadingCoupon, setLoadingCoupon] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [couponsList, setCouponsList] = useState<string[]>([]);

    useEffect(() => {
        getCoupons()
            .then((list) => setCouponsList(list.map((c) => c.code)))
            .catch(() => {});
    }, []);

    const subtotal = calculateSubtotal();
    const total = calculateTotal();

    const formatBRL = (v: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
    const perInstallment = (installments > 0 ? Math.round((total / installments) * 100) / 100 : 0);

    const handleOpenCoupon = () => {
        setShowCoupon(true);
        setError(null);
        setCouponInput(couponCode ?? '');
    };

    const handleCancelCoupon = () => {
        setShowCoupon(false);
        setError(null);
        setCouponInput('');
    };

    const handleApplyCoupon = async () => {
        setError(null);
        setLoadingCoupon(true);
        try {
            const res = await validateCoupon(couponInput.trim());
            if (!res.valid || !res.discount) {
                setError('Código de cupom inválido');
                return;
            }
            applyCoupon(res.discount, couponInput.trim());
            setCouponCode(couponInput.trim());
            setShowCoupon(false);
        } catch {
            setError('Falha ao validar o cupom');
        } finally {
            setLoadingCoupon(false);
        }
    };

    const hasBaseDiscount = selectedPlan === 'anual' && installments === 1;
    const couponApplied = !!couponCode && couponPercent > 0;

    return (
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

                {!couponApplied && hasBaseDiscount && (
                    <Row>
                        <Label>Desconto – 10%</Label>
                        <DiscountValue>
                            – {formatBRL(Math.round(subtotal * 0.1 * 100) / 100)}
                        </DiscountValue>
                    </Row>
                )}

                {selectedPlan === 'anual' && !couponApplied && (
                    <CouponButton type="button" aria-label="Tem um cupom de desconto?" onClick={handleOpenCoupon}>
                        <img src={tag} alt="Icone de uma etiqueta desenhada em cor roxa" />
                        Tem um cupom de desconto?
                    </CouponButton>
                )}

                {selectedPlan === 'anual' && showCoupon && (
                    <CouponBox aria-live="polite">
                        <CouponLabel>Cupom de desconto</CouponLabel>
                        <CouponInput
                            aria-invalid={!!error}
                            placeholder="Preencha o código"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            list="coupons"
                        />
                        {couponsList.length > 0 && (
                            <datalist id="coupons">
                                {couponsList.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        )}
                        {error && <CouponError>{error}</CouponError>}
                        <CouponActions>
                            <CouponCancel type="button" onClick={handleCancelCoupon}>Cancelar</CouponCancel>
                            <CouponApply type="button" onClick={handleApplyCoupon} disabled={loadingCoupon}>
                                ✓ Aplicar cupom
                            </CouponApply>
                        </CouponActions>
                    </CouponBox>
                )}

                {selectedPlan === 'anual' && couponApplied && (
                    <CouponSuccess>
                        <CouponSuccessTop>
                            <strong>Cupom aplicado!</strong>
                            <CouponSuccessRemove
                              type="button"
                              onClick={clearCoupon}
                              aria-label="Remover cupom"
                            >
                              ✕
                            </CouponSuccessRemove>
                        </CouponSuccessTop>
                        <span>Desconto de {formatBRL(Math.round(subtotal * (couponPercent / 100) * 100) / 100)}</span>
                    </CouponSuccess>
                )}

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