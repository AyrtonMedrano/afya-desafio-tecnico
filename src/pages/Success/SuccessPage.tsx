
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../../services/api';
import type { Subscription } from '../../types/checkout';
import styles from './SuccessPage.module.css';
import check from '../../assets/check.svg';
import lockOpen from '../../assets/lock-open.svg';
import notification from '../../assets/notification.svg';
import money from '../../assets/money.png';

export default function SuccessPage() {
    const { userId } = useParams<{ userId: string }>();
    const [sub, setSub] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getSubscription = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const s = await api.getSubscription(Number(userId));
                setSub(s);
                console.log('Dados da assinatura (success):', s);
            } catch (err) {
                console.error('Falha ao buscar assinatura:', err);
            } finally {
                setLoading(false);
            }
        };
        void getSubscription();
    }, [userId]);

    const currency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const maskedCard = (num: string) => num.replace(/\d(?=\d{4})/g, '*');

    return (
        <div className={styles.success}>

            {loading && (
                <div className={styles.loading} role="status" aria-live="polite" aria-label="Carregando">
                    <div className={styles.spinner} />
                </div>
            )}

            {!loading && sub && (
                <>
                    <section className={`${styles.hero}`}>
                        <div className={styles.heroLeft}>
                            <span className={styles.heroIcon}>
                                <img src={check} alt="" />
                            </span>
                            <span className={styles.heroTitle}>Seu teste grátis começou!</span>
                        </div>
                        <span className={styles.heroRight}>Você assinou Conteúdos Premium</span>
                    </section>

                    <section className={`${styles.card} ${styles.section}`}>
                        <div className={styles.sectionTitle}>Status da assinatura</div>

                        <div className={styles.timeline}>
                            <div className={styles.timelineTrack} />
                            <div className={styles.timelineSteps}>
                                <div className={styles.step}>
                                    <span className={styles.stepIcon}>
                                        <img src={lockOpen} alt="" />
                                    </span>
                                    <span className={styles.stepLabel}>Contratação</span>
                                </div>
                                <div className={styles.step}>
                                    <span className={styles.stepSecondIcon}>
                                        <img src={notification} alt="" />
                                    </span>
                                    <span className={styles.stepLabel}>Último dia grátis</span>
                                </div>
                                <div className={styles.step}>
                                    <span className={styles.stepThirdIcon}>
                                        <img src={money} alt="" />
                                    </span>
                                    <span className={styles.stepLabel}>Cobrança</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={`${styles.card} ${styles.contract}`}>
                        <div className={styles.sectionTitle}>Dados da contratação</div>

                        <div className={styles.contractGrid}>
                            <div className={styles.contractLeft}>
                                <div className={styles.col}>
                                    <div className={styles.row}>
                                        <span className={styles.label}>CPF</span>
                                        <span className={styles.value}>{sub.cardCpf}</span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Modalidade</span>
                                        <span className={styles.value}>
                                            {sub.period === 'annually' ? 'Assinatura anual*' : 'Assinatura mensal'}
                                        </span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Método</span>
                                        <span className={styles.value}>Cartão de crédito</span>
                                    </div>
                                </div>

                                <div className={styles.col}>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Número cartão</span>
                                        <span className={styles.value}>{maskedCard(sub.number)}</span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Parcelamento</span>
                                        <span className={styles.value}>
                                            {sub.installments}x de {currency(sub.price)}
                                        </span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Valor</span>
                                        <span className={styles.value}>{currency(sub.price)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.contractRight}>
                                <p>Enviamos um e-mail de confirmação com todos os dados da sua contratação.</p>
                                <p>
                                    Foi feita uma pré-autorização para validar seu cartão, que logo será cancelada.
                                    No fim do período de teste é feita a cobrança definitiva e sua assinatura fica ativa.
                                </p>
                                <p className={styles.notes}>
                                    *Após o pagamento do plano, a renovação automática fica ativa com a recorrência contratada.
                                    Valores promocionais não têm recorrência, e não serão aplicados na renovação.
                                </p>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}