import { useCheckoutStore } from './useCheckoutStore'

//Checklist de testes pro store
// - [x] Deve selecionar um plano - ?? iniciar com um selecionado ??
// - [x] Deve calcular o total corretamente para o plano mensal
// - [x] Deve calcular o total com 10% de desconto para plano anual em 1x
// - [x] Deve calcular o total sem desconto para plano anual em 2x ou mais

//LEMBRAR- Adicionais de cupoms (Bonus)
// - [ ] Deve calcular o total com desconto do cupom para plano anual em 1x
// - [ ] Deve calcular o total sem desconto do cupom para plano anual em 2x ou mais

describe('Checkout Store (lógica de estado)', () => {
  beforeEach(() => {
    useCheckoutStore.setState({
      selectedPlan: 'mensal',
      prices: { mensal: 60, anual: 700 },
      installments: 1,
    })
  })

  it('deve selecionar um plano', () => {
    const { selectPlan } = useCheckoutStore.getState()
    selectPlan('anual')
    expect(useCheckoutStore.getState().selectedPlan).toBe('anual')
  })

  it('deve calcular o total corretamente para o plano mensal', () => {
    const store = useCheckoutStore.getState()
    store.selectPlan('mensal')
    store.setPrices({ mensal: 60, anual: 700 })
    store.setInstallments(1)
    const total = store.calculateTotal()
    expect(total).toBe(60)
  })

  it('deve calcular o total com 10% de desconto para plano anual em 1x', () => {
    const store = useCheckoutStore.getState()
    store.selectPlan('anual')
    store.setPrices({ mensal: 60, anual: 700 })
    store.setInstallments(1)
    const total = store.calculateTotal()
    expect(total).toBe(630)
  })

  it('deve calcular o total sem desconto para plano anual em 2x ou mais', () => {
    const store = useCheckoutStore.getState()
    store.selectPlan('anual')
    store.setPrices({ mensal: 60, anual: 700 })
    store.setInstallments(2)
    const total = store.calculateTotal()
    expect(total).toBe(700)
  })
})