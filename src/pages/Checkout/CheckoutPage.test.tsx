import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import * as api from '../../services/api'
import type { Plan, Subscription } from '../../types/checkout'
import CheckoutPage from './CheckoutPage'

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

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('executa o fluxo feliz anual 1x até concluir a compra', async () => {
    jest.spyOn(api, 'getPlans').mockResolvedValue(plans)
    const postSpy = jest.spyOn(api, 'postSubscription').mockResolvedValue({
      cardCpf: '98765432100',
      method: 'credit_card',
      installments: 1,
      period: 'annually',
      number: '5555444433332222',
      price: 630,
    } as Subscription)

    render(<CheckoutPage />)

    // Planos exibidos
    expect(await screen.findByLabelText(/Mensal/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Anual/i)).toBeInTheDocument()

    // Seleciona "Anual"
    await userEvent.click(screen.getByLabelText(/Anual/i))

    // Campo de parcelas aparece (apenas para anual)
    expect(await screen.findByLabelText(/Número de parcelas/i)).toBeInTheDocument()

    // Resumo atualizado com desconto de 10% (700 -> 630)
    expect(screen.getByText(/Resumo/i)).toBeInTheDocument()
    expect(screen.getByText(/Total/i)).toBeInTheDocument()
    expect(screen.getByText(/R\$ 630,00/i)).toBeInTheDocument()

    // Preenche formulário
    await userEvent.type(screen.getByLabelText(/Nome impresso no cartão/i), 'John Doe')
    await userEvent.type(screen.getByLabelText(/Número do cartão/i), '5555444433332222')
    await userEvent.type(screen.getByLabelText(/Validade/i), '10/21')
    await userEvent.type(screen.getByLabelText(/CVV/i), '123')
    await userEvent.type(screen.getByLabelText(/CPF/i), '98765432100')
    await userEvent.clear(screen.getByLabelText(/Número de parcelas/i))
    await userEvent.type(screen.getByLabelText(/Número de parcelas/i), '1')

    // Finaliza compra
    await userEvent.click(screen.getByRole('button', { name: /Finalizar Compra/i }))

    // Verifica chamada ao postSubscription com os dados certos
    expect(postSpy).toHaveBeenCalledTimes(1)
    expect(postSpy).toHaveBeenCalledWith({
      storeId: 'pagamento_anual_a_vista',
      cardCpf: '98765432100',
      CVV: '123',
      expirationDate: '10/21',
      holder: 'John Doe',
      number: '5555444433332222',
      installments: 1,
      couponCode: null,
      userId: 1,
    })
  })
})