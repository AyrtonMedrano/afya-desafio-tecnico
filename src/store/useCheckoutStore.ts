import { create } from 'zustand'

type Plano = 'mensal' | 'anual'

interface PaymentData {
  cardNumber: string
  nameOnCard: string
  expiry: string
  cvv: string
  cpf: string
}

interface CheckoutState {
  selectedPlan: Plano
  prices: { mensal: number; anual: number }
  installments: number
  payment: PaymentData
  selectPlan: (plan: Plano) => void
  setInstallments: (n: number) => void
  setPrices: (prices: { mensal: number; anual: number }) => void
  updatePayment: (patch: Partial<PaymentData>) => void
  calculateSubtotal: () => number
  calculateDiscount: () => number
  calculateTotal: () => number
  // estado de cupom
  couponCode: string | null
  couponPercent: number
  setCouponCode: (code: string | null) => void
  applyCoupon: (percent: number, code: string) => void
  clearCoupon: () => void
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  selectedPlan: 'mensal',
  prices: { mensal: 0, anual: 0 },
  installments: 1,
  payment: {
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: '',
    cpf: '',
  },

  selectPlan: (plan) =>
    set({ selectedPlan: plan, installments: 1 }),

  setInstallments: (n) => set({ installments: n }),
  setPrices: (prices) => set({ prices }),
  updatePayment: (patch) =>
    set((state) => ({ payment: { ...state.payment, ...patch } })),

  couponCode: null,
  couponPercent: 0,
  setCouponCode: (code) => set({ couponCode: code }),
  applyCoupon: (percent, code) => set({ couponPercent: percent, couponCode: code }),
  clearCoupon: () => set({ couponPercent: 0, couponCode: null }),

  calculateSubtotal: () => {
    const { selectedPlan, prices } = get()
    return Math.round(
      (selectedPlan === 'mensal' ? prices.mensal : prices.anual) * 100
    ) / 100
  },

  calculateDiscount: () => {
    const { selectedPlan, prices, installments, couponPercent } = get();
    const basePrice = selectedPlan === 'mensal' ? prices.mensal : prices.anual;
    let price = basePrice;

    if (selectedPlan === 'anual' && installments === 1) {
      price = Math.round(price * 0.9 * 100) / 100;
    }
    if (couponPercent > 0) {
      price = Math.round(price * (1 - couponPercent / 100) * 100) / 100;
    }

    const discount = Math.round((basePrice - price) * 100) / 100;
    return discount;
  },

  calculateTotal: () => {
    const { selectedPlan, prices, installments, couponPercent } = get();
    let price = selectedPlan === 'mensal' ? prices.mensal : prices.anual;

    if (selectedPlan === 'anual' && installments === 1) {
      price = Math.round(price * 0.9 * 100) / 100;
    }
    if (couponPercent > 0) {
      price = Math.round(price * (1 - couponPercent / 100) * 100) / 100;
    }

    return Math.round(price * 100) / 100;
  },
}))