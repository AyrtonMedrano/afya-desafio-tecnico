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
    set((state: CheckoutState) => ({
      selectedPlan: plan,
      installments: plan === 'mensal' ? 1 : state.installments,
    })),

  setInstallments: (n) => set({ installments: n }),
  setPrices: (prices) => set({ prices }),
  updatePayment: (patch) =>
    set((state) => ({ payment: { ...state.payment, ...patch } })),

  // Subtotal sem considerar desconto
  calculateSubtotal: () => {
    const { selectedPlan, prices } = get()
    return Math.round(
      (selectedPlan === 'mensal' ? prices.mensal : prices.anual) * 100
    ) / 100
  },

  // Desconto apenas para anual 1x (10%)
  calculateDiscount: () => {
    const { selectedPlan, prices, installments } = get()
    if (selectedPlan === 'anual' && installments === 1) {
      return Math.round(prices.anual * 0.1 * 100) / 100
    }
    return 0
  },

  // Total com regras existentes
  calculateTotal: () => {
    const { selectedPlan, prices, installments } = get()
    if (selectedPlan === 'mensal') {
      return Math.round(prices.mensal * 100) / 100
    }
    if (installments === 1) {
      return Math.round(prices.anual * 0.9 * 100) / 100
    }
    return Math.round(prices.anual * 100) / 100
  },
}))