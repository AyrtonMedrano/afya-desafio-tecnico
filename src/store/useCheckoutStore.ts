import { create } from 'zustand'

type Plano = 'mensal' | 'anual'

interface CheckoutState {
  selectedPlan: Plano
  prices: { mensal: number; anual: number }
  installments: number
  selectPlan: (plan: Plano) => void
  setInstallments: (n: number) => void
  setPrices: (prices: { mensal: number; anual: number }) => void
  calculateTotal: () => number
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  selectedPlan: 'mensal',
  prices: { mensal: 0, anual: 0 },
  installments: 1,

  selectPlan: (plan) =>
    set((state: CheckoutState) => ({
      selectedPlan: plan,
      installments: plan === 'mensal' ? 1 : state.installments,
    })),

  setInstallments: (n) => set({ installments: n }),
  setPrices: (prices) => set({ prices }),

//  LEMBRAR- Implementar lógica

//  Checklist deos calculos
// - Mensal: retorna prices.mensal .
// - Anual 1x: aplica 10% de desconto ( prices.anual * 0.9 ).
// - Anual com 2x ou mais: retorna prices.anual .
// - Arredonda para 2 casas decimais para evitar imprecisão.

  calculateTotal: () => {
    const { selectedPlan, prices, installments } = get()
    // Mensal: retorna prices.mensal 
    if (selectedPlan === 'mensal') {
      return Math.round(prices.mensal * 100) / 100
    }
   //Desconto de 10% para anual a vista
    if (installments === 1) {
      return Math.round(prices.anual * 0.9 * 100) / 100
    }
    // Sem desconto para anual com 2x ou mais
    return Math.round(prices.anual * 100) / 100
  },
}))