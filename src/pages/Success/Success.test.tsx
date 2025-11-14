import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { jest } from '@jest/globals'

// Mock da API para carregar a assinatura
jest.unstable_mockModule('../../services/api', () => ({
  getSubscription: jest.fn(),
}))

describe('SuccessPage', () => {
  it('renders a success message', async () => {
    const { getSubscription } = await import('../../services/api')
    const { default: SuccessPage } = await import('./SuccessPage')

    const getSubscriptionMock = getSubscription as jest.MockedFunction<typeof getSubscription>
    getSubscriptionMock.mockResolvedValue({
      cardCpf: '98765432100',
      method: 'credit_card' as const,
      installments: 1,
      period: 'annually' as const,
      number: '5555444433332222',
      price: 630,
    })

    render(
      <MemoryRouter initialEntries={['/success/1']}>
        <Routes>
          <Route path="/success/:userId" element={<SuccessPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('Seu teste grátis começou!')).toBeInTheDocument()
  })
})