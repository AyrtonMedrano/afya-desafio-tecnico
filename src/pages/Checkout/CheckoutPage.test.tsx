import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import type { Plan, Subscription } from '../../types/checkout'
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.unstable_mockModule('../../services/api', () => ({
  getPlans: jest.fn(),
  postSubscription: jest.fn(),
  getCoupons: jest.fn(),
  validateCoupon: jest.fn(),
}))

//Checklist de testes
// - Renderiza a página.
// - Simula a API getPlans (mock).
// - Verifica se os planos são exibidos.
// - Simula clique no plano "Anual".
// - Verifica se o campo de parcelas aparece (Após clique em anual).
// - Verifica se o resumo atualiza com o preço.
// - Preenche o formulário com campos: nome, cartão, CPF, e outros.
// - Simula clique em "Finalizar Compra".
// - Verifica se a função de post foi chamada com os dados corretos.

describe('CheckoutPage (fluxo principal - simulaçao de caminho feliz)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('executa o fluxo feliz anual 1x até concluir a compra', async () => {
    const { getPlans, postSubscription, getCoupons, validateCoupon } = await import('../../services/api')
    const { default: CheckoutPage } = await import('./CheckoutPage')

    const getPlansMock = getPlans as jest.MockedFunction<typeof getPlans>
    const postSubscriptionMock = postSubscription as jest.MockedFunction<typeof postSubscription>
    const getCouponsMock = getCoupons as jest.MockedFunction<typeof getCoupons>
    const validateCouponMock = validateCoupon as jest.MockedFunction<typeof validateCoupon>

    getCouponsMock.mockResolvedValue([])
    validateCouponMock.mockResolvedValue({ valid: false })

    const plans: Plan[] = [
      {
        id: 33,
        storeId: 'pagamento_anual_a_vista',
        title: 'Anual',
        description: 'Pagamento à vista ou R$ 700,00 até 12x',
        fullPrice: 700,
        discountAmmount: 70,
        discountPercentage: 10,
        periodLabel: 'ano',
        period: 'annually',
        discountCouponCode: null,
        order: 1,
        installments: 12,
        acceptsCoupon: true,
      },
      {
        id: 32,
        storeId: 'pagamento_mensal',
        title: 'Mensal',
        description: 'Fica apenas R$ 2 por dia',
        fullPrice: 60,
        discountAmmount: null,
        discountPercentage: null,
        periodLabel: 'mês',
        period: 'monthly',
        discountCouponCode: null,
        order: 2,
        installments: 1,
        acceptsCoupon: false,
      },
    ]

    getPlansMock.mockResolvedValue(plans)
    postSubscriptionMock.mockResolvedValue({
      cardCpf: '98765432100',
      method: 'credit_card',
      installments: 1,
      period: 'annually',
      number: '5555444433332222',
      price: 630,
    } as Subscription)

    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success/:id" element={<div>Success Route</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByLabelText(/Mensal/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Anual/i)).toBeInTheDocument()
    await userEvent.click(screen.getByLabelText(/Anual/i))
    expect(await screen.findByLabelText(/Número de parcelas/i)).toBeInTheDocument()
    expect(screen.getByText(/Resumo/i)).toBeInTheDocument()
    expect(screen.getByText(/^Total$/i)).toBeInTheDocument()
    expect(screen.getAllByText(/R\$ 630,00/i).length).toBeGreaterThan(0)
    await userEvent.type(screen.getByLabelText(/Nome impresso no cartão/i), 'John Doe')
    await userEvent.type(screen.getByLabelText(/Número do cartão/i), '4111 1111 1111 1111')
    await userEvent.type(screen.getByLabelText(/Validade/i), '12/29')
    await userEvent.type(screen.getByLabelText(/Código de segurança/i), '123')
    await userEvent.type(screen.getByLabelText(/CPF/i), '98765432100')
    await userEvent.click(screen.getByRole('button', { name: /Finalizar Compra/i }))

    expect(await screen.findByText(/Success Route/i)).toBeInTheDocument()

  
  })
})