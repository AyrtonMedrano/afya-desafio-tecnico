import { getPlans, postSubscription, validateCoupon } from './api'
import type { Plan, SubscriptionRequest } from '../types/checkout'
import { jest } from '@jest/globals'

type JsonResponse<T> = {
  ok: boolean
  json: () => Promise<T>
}

const mockFetchJson = <T>(data: T, ok = true) => {
  const resp: JsonResponse<T> = { ok, json: async () => data }
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>
  fetchMock.mockResolvedValue(resp as unknown as Response)
  globalThis.fetch = fetchMock
}

describe('API Service', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('getPlans retorna lista de planos', async () => {
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

    mockFetchJson(plans)

    await expect(getPlans()).resolves.toEqual(plans)
    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/plans$/))
  })

  it('postSubscription envia dados e retorna assinatura', async () => {
    const req: SubscriptionRequest = {
      storeId: 'pagamento_anual_a_vista',
      cardCpf: '98765432100',
      CVV: '123',
      expirationDate: '10/21',
      holder: 'John Doe',
      number: '5555444433332222',
      installments: 1,
      couponCode: null,
      userId: 1,
    }

    const response = {
      cardCpf: '98765432100',
      method: 'credit_card' as const,
      installments: 1,
      period: 'annually' as const,
      number: '5555444433332222',
      price: 630,
    }

    mockFetchJson(response)

    await expect(postSubscription(req)).resolves.toEqual(response)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/subscription$/),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('validateCoupon retorna válido e desconto quando existir', async () => {
    mockFetchJson({ valid: true, discount: 10 })

    await expect(validateCoupon('AFYAWB001')).resolves.toEqual({ valid: true, discount: 10 })
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/coupon\/validate$/),
      expect.objectContaining({ method: 'POST' })
    )
  })
})