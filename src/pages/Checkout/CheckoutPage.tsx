import { useEffect, useState, useMemo } from 'react';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import * as api from '../../services/api';
import type { Plan } from '../../types/checkout';
import CardProduct from '../../components/CardProduct/CardProduct';
import styles from './CheckoutPage.module.css';

type PlanoTitle = 'mensal' | 'anual';

export default function CheckoutPage() {
  const { selectedPlan, selectPlan, setPrices } = useCheckoutStore();
  const [plans, setPlans] = useState<Plan[]>([]);

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
            <h5 className={styles['checkout__section-title']}>
              Insira os dados de pagamento
            </h5>
            <div className={styles['checkout__card']}>
            </div>
          </div>
          <div className={styles['checkout__column']}>
            <h5 className={styles['checkout__section-title']}>Resumo</h5>
            <div className={styles['checkout__card']}>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}