import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './PaymentForm.module.css';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import { formatCardNumber, normalizeCardDigits, luhnCheck, detectCardBrand } from '../../utils/formatCardNumber';
import { formatExpiry, isExpiryFuture, formatCpf } from '../../utils/formatCardNumber';
import { InstallmentsDrawer } from '../Drawer/InstallmentsDrawer';
import mastercard from '../../assets/mastercard.svg';
import diners from '../../assets/dinnersclub.svg';
import amex from '../../assets/americanexpress.svg';
import visa from '../../assets/visa.svg';
import elo from '../../assets/elo.svg';
import chevronsRight from '../../assets/chevrons-right.svg';


const paymentSchema = z.object({
    cardNumber: z
        .string()
        .min(1, 'Campo obrigatório')
        .refine((v) => /^[\d\s]+$/.test(v), 'Apenas números')
        .refine((v) => normalizeCardDigits(v).length >= 13, 'Número de cartão incompleto')
        .refine((v) => luhnCheck(normalizeCardDigits(v)), 'Número de cartão inválido'),
    nameOnCard: z
        .string()
        .min(3, 'Campo obrigatório')
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ'’\s]+$/, 'Somente letras'),
    expiry: z
        .string()
        .min(1, 'Campo obrigatório')
        .regex(/^([0][1-9]|1[0-2])\/\d{2}$/, 'Formato inválido (MM/AA)')
        .refine((v) => {
            const [mm, yy] = v.split('/');
            return isExpiryFuture(mm ?? '', yy ?? '');
        }, 'Data de validade deve ser posterior ao mês atual'),
    cvv: z
        .string()
        .min(1, 'Mínimo 3 caracteres')
        .max(4, 'Máximo 4 caracteres')
        .refine((v) => /^\d+$/.test(v), 'Somente números'),
    cpf: z
        .string()
        .min(1, 'Campo obrigatório'),
    installments: z.string().min(1, 'Campo obrigatório'),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

type PaymentFormProps = {
    onSubmit: (values: Omit<PaymentFormValues, 'installments'> & { installments: number }) => void;
    onOpenInstallments?: () => void;
};

export type PaymentFormRef = {
    submit: () => void;
    getValues: () => PaymentFormValues;
    setInstallments: (n: number) => void;
};

export const PaymentForm = forwardRef<PaymentFormRef, PaymentFormProps>(function PaymentForm(
    { onSubmit, onOpenInstallments },
    ref
) {
    const [brand, setBrand] = useState<'visa' | 'mastercard' | 'amex' | 'diners' | 'elo' | 'unknown'>('unknown');
    const iconByBrand = { mastercard, diners, amex, visa, elo } as const;
    const { selectedPlan, setInstallments: setStoreInstallments, updatePayment } = useCheckoutStore();
    const [showInstallments, setShowInstallments] = useState(true);
    const [installmentsOpen, setInstallmentsOpen] = useState(false);

    // Apenas mostra parcelas quando for anual
    const shouldShowInstallments = showInstallments && selectedPlan === 'anual';

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        getValues,
        setValue,
    } = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            cardNumber: '',
            nameOnCard: '',
            expiry: '',
            cvv: '',
            cpf: '',
            installments: shouldShowInstallments ? '' : '1',
        },
        mode: 'onBlur',
    });

    useEffect(() => {
        const sub = watch((values) => {
            updatePayment({
                cardNumber: values.cardNumber ?? '',
                nameOnCard: values.nameOnCard ?? '',
                expiry: values.expiry ?? '',
                cvv: values.cvv ?? '',
                cpf: values.cpf ?? '',
            });
            if (values.installments) {
                const n = Number(values.installments);
                if (!Number.isNaN(n)) setStoreInstallments(n);
            }
        });
        return () => sub.unsubscribe();
    }, [watch, updatePayment, setStoreInstallments]);

    const submitHandler = (values: PaymentFormValues) => {
        onSubmit({
            ...values,
            installments: Number(values.installments || '0'),
        });
    };

    useImperativeHandle(ref, () => ({
        submit: () => handleSubmit(submitHandler)(),
        getValues: () => getValues(),
        setInstallments: (n: number) =>
            setValue('installments', String(n), { shouldValidate: true, shouldDirty: true }),
    }));

    const handleOpenInstallmentsClick = () => {
        setInstallmentsOpen(true);
        onOpenInstallments?.();
    };

    const handleConfirmInstallments = (n: number) => {
        setValue('installments', String(n), { shouldValidate: true, shouldDirty: true });
        setInstallmentsOpen(false);
    };

    useEffect(() => {
        if(selectedPlan==='mensal'){
            setShowInstallments(false);
            setValue('installments', '1', { shouldValidate: true, shouldDirty: true });
        }
        if(selectedPlan==='anual'){
            setShowInstallments(true);
            setValue('installments', '1', { shouldValidate: true, shouldDirty: true });
        }
    }, [selectedPlan, setValue]);

    // Valor atual das parcelas para exibir no trigger
    const selectedInstallments = watch('installments');

    return (
        <section className={styles['payment-form']}>
            <form className={styles['payment-form__box']} onSubmit={handleSubmit(submitHandler)} noValidate>
                <input type="hidden" {...register('installments')} />
                <div className={styles['payment-form__brands']}>
                    <span className={styles['payment-form__brands-label']}>Bandeiras aceitas</span>
                    <div className={styles['payment-form__brands-icons']}>
                        <span
                            className={`${styles['payment-form__brand-placeholder']} ${brand === 'mastercard' ? styles['payment-form__brand-placeholder--active'] : ''}`}
                            aria-label="Mastercard"
                        >
                            <img src={mastercard} alt="" aria-hidden />
                        </span>

                        <span
                            className={`${styles['payment-form__brand-placeholder']} ${brand === 'diners' ? styles['payment-form__brand-placeholder--active'] : ''}`}
                            aria-label="Diners"
                        >
                            <img src={diners} alt="" aria-hidden />
                        </span>

                        <span
                            className={`${styles['payment-form__brand-placeholder']} ${brand === 'amex' ? styles['payment-form__brand-placeholder--active'] : ''}`}
                            aria-label="Amex"
                        >
                            <img src={amex} alt="" aria-hidden />
                        </span>

                        <span
                            className={`${styles['payment-form__brand-placeholder']} ${brand === 'visa' ? styles['payment-form__brand-placeholder--active'] : ''}`}
                            aria-label="Visa"
                        >
                            <img src={visa} alt="" aria-hidden />
                        </span>

                        <span
                            className={`${styles['payment-form__brand-placeholder']} ${brand === 'elo' ? styles['payment-form__brand-placeholder--active'] : ''}`}
                            aria-label="Elo"
                        >
                            <img src={elo} alt="" aria-hidden />
                        </span>
                    </div>
                </div>

                <label className={styles['payment-form__field']}>
                    <span className={styles['payment-form__label']}>Número do cartão</span>
                    <div className={styles['payment-form__input-with-icon']}>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className={`${styles['payment-form__input']} ${errors.cardNumber ? styles['payment-form__input--error'] : ''}`}
                            {...register('cardNumber', {
                                onChange: (e) => {
                                    const value = (e.target as HTMLInputElement).value;
                                    const { formatted, digits } = formatCardNumber(value);
                                    setValue('cardNumber', formatted, { shouldValidate: true, shouldDirty: true });
                                    setBrand(detectCardBrand(digits));
                                },
                            })}
                            aria-invalid={!!errors.cardNumber}
                        />
                        {brand !== 'unknown' && (
                            <span className={styles['payment-form__helper-icon']} aria-hidden>
                                <img src={iconByBrand[brand]} alt="" />
                            </span>
                        )}
                    </div>
                    <span className={styles['payment-form__error']}>Campo obrigatório</span>
                </label>

                <label className={styles['payment-form__field']}>
                    <span className={styles['payment-form__label']}>Nome impresso no cartão</span>
                    <input
                        type="text"
                        placeholder="Preencha igual ao cartão"
                        className={`${styles['payment-form__input']} ${errors.nameOnCard ? styles['payment-form__input--error'] : ''
                            }`}
                        {...register('nameOnCard', {
                            onChange: (e) => {
                                const value = (e.target as HTMLInputElement).value;
                                const sanitized = value.replace(/\d+/g, '');
                                if (sanitized !== value) {
                                    setValue('nameOnCard', sanitized, { shouldValidate: true, shouldDirty: true });
                                }
                            },
                        })}
                        aria-invalid={!!errors.nameOnCard}
                        inputMode="text"
                        autoCapitalize="words"
                    />
                    <span className={styles['payment-form__error']}>Campo obrigatório</span>
                </label>

                <div className={styles['payment-form__row']}>
                    <label className={styles['payment-form__field']}>
                        <span className={styles['payment-form__label']}>Validade</span>
                        <input
                            type="text"
                            placeholder="MM/AA"
                            className={`${styles['payment-form__input']} ${errors.expiry ? styles['payment-form__input--error'] : ''
                                }`}
                            {...register('expiry', {
                                onChange: (e) => {
                                    const value = (e.target as HTMLInputElement).value;
                                    const { formatted } = formatExpiry(value);
                                    setValue('expiry', formatted, { shouldValidate: true, shouldDirty: true });
                                },
                            })}
                            aria-invalid={!!errors.expiry}
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                        <span className={styles['payment-form__error']}>Campo obrigatório</span>
                    </label>

                    <label className={styles['payment-form__field']}>
                        <span className={styles['payment-form__label']}>Código de segurança</span>
                        <div className={styles['payment-form__input-with-icon']}>
                            <input
                                type="text"
                                placeholder="000"
                                className={`${styles['payment-form__input']} ${errors.cvv ? styles['payment-form__input--error'] : ''
                                    }`}
                                {...register('cvv', {
                                    onChange: (e) => {
                                        const value = (e.target as HTMLInputElement).value;
                                        const digits = value.replace(/\D/g, '').slice(0, 4);
                                        setValue('cvv', digits, { shouldValidate: true, shouldDirty: true });
                                    },
                                })} aria-invalid={!!errors.cvv}
                            />
                            {/* <span className={styles['payment-form__helper-icon']} /> */}
                        </div>
                        <span className={styles['payment-form__error']}>Campo obrigatório</span>
                    </label>
                </div>

                <label className={styles['payment-form__field']}>
                    <span className={styles['payment-form__label']}>CPF do portador do cartão</span>
                    <input
                        type="text"
                        placeholder="000.000.000-00"
                        className={`${styles['payment-form__input']} ${
                            errors.cpf ? styles['payment-form__input--error'] : ''
                        }`}
                        {...register('cpf', {
                            onChange: (e) => {
                                const value = (e.target as HTMLInputElement).value;
                                const { formatted } = formatCpf(value);
                                setValue('cpf', formatted, { shouldValidate: true, shouldDirty: true });
                            },
                        })}
                        aria-invalid={!!errors.cpf}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                    <span className={styles['payment-form__error']}>Campo obrigatório</span>
                </label>

                {shouldShowInstallments && (
                    <label className={styles['payment-form__field']}>
                        <span className={styles['payment-form__label']}>Número de parcelas</span>
                        <div className={styles['payment-form__select-wrapper']}>
                            <button
                                type="button"
                                onClick={handleOpenInstallmentsClick}
                                className={`${styles['payment-form__select-trigger']} ${errors.installments ? styles['payment-form__select-trigger--error'] : ''}`}
                                aria-invalid={!!errors.installments}
                            >
                                {selectedInstallments ? (
                                    <span className={styles['payment-form__select-trigger-value']}>
                                        {Number(selectedInstallments)}x
                                    </span>
                                ) : (
                                    <span className={styles['payment-form__select-trigger-placeholder']}>
                                        Selecione o número de parcelas
                                    </span>
                                )}
                                <span className={styles['payment-form__select-arrow']} aria-hidden>
                                    <img src={chevronsRight} alt="Seta para direita" />
                                </span>
                            </button>
                        </div>
                        <span className={styles['payment-form__error']}>
                            {errors.installments?.message ?? ' '}
                        </span>
                    </label>
                )}

                
            </form>

            {/* Drawer de Parcelas */}
            <InstallmentsDrawer
                isOpen={installmentsOpen}
                onClose={() => setInstallmentsOpen(false)}
                onConfirm={handleConfirmInstallments}
            />
        </section>
    );
    
});
