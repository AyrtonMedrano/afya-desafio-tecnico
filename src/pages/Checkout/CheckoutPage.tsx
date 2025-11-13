import { useEffect, useState, useMemo, useRef } from 'react';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import * as api from '../../services/api';
import type { Plan, SubscriptionRequest } from '../../types/checkout';
import CardProduct from '../../components/CardProduct/CardProduct';
import styles from './CheckoutPage.module.css';
import { PaymentForm } from '../../components/PaymentForm/PaymentForm';
import type { PaymentFormRef } from '../../components/PaymentForm/PaymentForm';
import { Summary } from '../../components/Summary/Summary';

type PlanoTitle = 'mensal' | 'anual';

export default function CheckoutPage() {
  const { selectedPlan, selectPlan, setPrices, installments } =
    useCheckoutStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const paymentFormRef = useRef<PaymentFormRef>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await api.getPlans();
        setPlans(plansData);
        const monthly = plansData.find(p => p.title.toLowerCase() === 'mensal');
        const annually = plansData.find(p => p.title.toLowerCase() === 'anual');
        if (monthly && annually) {
          setPrices({ mensal: monthly.fullPrice, anual: annually.fullPrice });
        }
      } catch (error) {
        console.error('Erro ao buscar planos:', error);
      }
    };

    if (plans.length === 0) {
      void fetchPlans();
    }
  }, [plans.length, setPrices]);

  const bestOfferId = useMemo(() => {
    const monthlyPlan = plans.find((p) => p.title.toLowerCase() === 'mensal');
    const annualPlan = plans.find((p) => p.title.toLowerCase() === 'anual');

    if (monthlyPlan && annualPlan) {
      if (monthlyPlan.fullPrice * 12 > annualPlan.fullPrice) {
        return annualPlan.id;
      }
    }
    return null;
  }, [plans]);

  const handleOpenInstallments = () => {
    console.log('Abrir seleção de parcelas (offCanvas futuro)');
  };

  const handlePaymentSubmit = async (values: {
    cardNumber: string;
    nameOnCard: string;
    expiry: string;
    cvv: string;
    cpf: string;
    installments: number;
  }) => {
    const plan = plans.find((p) => p.title.toLowerCase() === selectedPlan);
    if (!plan) {
      console.error('Plano selecionado não encontrado');
      return;
    }

    const req: SubscriptionRequest = {
      storeId: plan.storeId,
      cardCpf: values.cpf,
      CVV: values.cvv,
      expirationDate: values.expiry,
      holder: values.nameOnCard,
      number: values.cardNumber,
      installments: values.installments || installments,
      couponCode: null,
      userId: 1,
    };

    try {
      const result = await api.postSubscription(req);
      console.log('Assinatura criada:', result);
      // TODO: navegar para sucesso quando pronto
    } catch (err) {
      console.error('Falha ao criar assinatura:', err);
    }
  };

  const finalizeFromSummary = () => {
    paymentFormRef.current?.submit();
  };

  return (
    <div className={styles.checkout}>
      <header className={styles['checkout__header']}>
        <h1>Afya</h1>
      </header>
        <div className={styles['checkout__header-inner']}>
          <h1 className={styles['checkout__title']}>
            Aproveite o melhor do Whitebook!
          </h1>
          <span className={styles['checkout__user']}>usuario@email.com</span>
        </div>
      <main className={styles['checkout__main']}>
        <div className={styles['checkout__columns']}>
          <div className={styles['checkout__column-signature']}>
            <h2 >
              Selecione sua assinatura
            </h2>
            <div className={styles['checkout__card-list']}>
              {plans.map((plan) => (
                <CardProduct
                  key={plan.id}
                  title={plan.title}
                  price={plan.fullPrice}
                  pricePer={plan.periodLabel}
                  description={plan.description}
                  bestOffer={plan.id === bestOfferId}
                  isSelected={selectedPlan === plan.title.toLowerCase()}
                  onSelect={() =>
                    selectPlan(plan.title.toLowerCase() as PlanoTitle)
                  }
                />
              ))}
            </div>
          </div>
          <div className={styles['checkout__column-payment']}>
            <h5 className={styles['checkout__section-title']}>Insira os dados de pagamento</h5>
            <PaymentForm
              ref={paymentFormRef}
              onOpenInstallments={handleOpenInstallments}
              onSubmit={handlePaymentSubmit}
            />
          </div>
          <div className={styles['checkout__column']}>
            <h5 className={styles['checkout__section-title']}>Resumo</h5>
            <Summary />
            
            <button
              type="button"
              onClick={finalizeFromSummary}
              aria-label="Finalizar Compra"
              className={styles['checkout__button-finalize']}
              
            >
              Finalizar assinatura
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}