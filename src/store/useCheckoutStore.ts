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

  // cupom
  couponCode: null,
  couponPercent: 0,
  setCouponCode: (code) => set({ couponCode: code }),
  applyCoupon: (percent, code) => set({ couponPercent: percent, couponCode: code }),
  clearCoupon: () => set({ couponPercent: 0, couponCode: null }),

  // Subtotal sem considerar desconto
  calculateSubtotal: () => {
    const { selectedPlan, prices } = get()
    return Math.round(
      (selectedPlan === 'mensal' ? prices.mensal : prices.anual) * 100
    ) / 100
  },

  // Desconto base (10% anual 1x) + adicional do cupom (percentual sobre preço anual)
  calculateDiscount: () => {
    const { selectedPlan, prices, installments, couponPercent } = get()
    let discount = 0
    if (selectedPlan === 'anual' && installments === 1) {
      discount += prices.anual * 0.1
      if (couponPercent > 0) {
        discount += prices.anual * (couponPercent / 100)
      }
    }
    return Math.round(discount * 100) / 100
  },

  // Total com regras existentes e cupom (apenas anual 1x recebe cupom adicional)
  calculateTotal: () => {
    const { selectedPlan, prices, installments, couponPercent } = get()
    if (selectedPlan === 'mensal') {
      return Math.round(prices.mensal * 100) / 100
    }
    if (installments === 1) {
      const basePercent = 0.1 + (couponPercent > 0 ? couponPercent / 100 : 0)
      const total = prices.anual * (1 - basePercent)
      return Math.round(total * 100) / 100
    }
    return Math.round(prices.anual * 100) / 100
  },
}))