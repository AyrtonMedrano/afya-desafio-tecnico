import { render, screen } from '@testing-library/react';
// import { jest } from '@jest/globals';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import { Summary } from './Summary';

describe('Summary', () => {
  beforeEach(() => {
    useCheckoutStore.setState({
      selectedPlan: 'anual',
      prices: { mensal: 60, anual: 700 },
      installments: 1,
      payment: { cardNumber: '', nameOnCard: '', expiry: '', cvv: '', cpf: '' },
      selectPlan: useCheckoutStore.getState().selectPlan,
      setInstallments: useCheckoutStore.getState().setInstallments,
      setPrices: useCheckoutStore.getState().setPrices,
      updatePayment: useCheckoutStore.getState().updatePayment,
      calculateSubtotal: useCheckoutStore.getState().calculateSubtotal,
      calculateDiscount: useCheckoutStore.getState().calculateDiscount,
      calculateTotal: useCheckoutStore.getState().calculateTotal,
    });
  });

  it('exibe subtotal e total para anual 1x', () => {
    render(<Summary />);

    expect(screen.getAllByText(/Subtotal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/R\$ 700,00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Total/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/R\$\s*630,00/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/1x de R\$ 630,00/i)).toBeInTheDocument();
  });

  it('atualiza a linha de parcelas para anual 2x', () => {
    useCheckoutStore.getState().setInstallments(2);
    render(<Summary />);

    expect(screen.getAllByText(/R\$ 700,00/).length).toBeGreaterThan(0);
    expect(screen.getByText(/2x de R\$ 350,00/i)).toBeInTheDocument();
  });

  it('mensal não possui desconto e total é o preço mensal', () => {
    useCheckoutStore.getState().selectPlan('mensal');
    render(<Summary />);

    expect(screen.getAllByText(/Subtotal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/R\$ 60,00/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Total/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/R\$ 60,00/i).length).toBeGreaterThan(0);
  });
});