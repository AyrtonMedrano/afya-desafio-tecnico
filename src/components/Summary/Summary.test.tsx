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

  it('exibe subtotal, desconto 10% para anual 1x e total', () => {
    render(<Summary />);
    expect(screen.getByText('Resumo')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 700,00/)).toBeInTheDocument();
    expect(screen.getByText(/– R\$ 70,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 630,00/)).toBeInTheDocument();
    expect(screen.getByText(/1x de R\$ 630,00/)).toBeInTheDocument();
  });

  it('remove desconto quando anual em 2x e recalcula linha de parcelas', () => {
    useCheckoutStore.getState().setInstallments(2);
    render(<Summary />);
    expect(screen.queryByText(/– R\$ 70,00/)).not.toBeInTheDocument();
    expect(screen.getByText(/R\$ 700,00/)).toBeInTheDocument();
    expect(screen.getByText(/2x de R\$ 350,00/)).toBeInTheDocument();
  });

  it('mensal não possui desconto e total é o preço mensal', () => {
    useCheckoutStore.getState().selectPlan('mensal');
    render(<Summary />);
    expect(screen.getByText(/Subtotal/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 60,00/)).toBeInTheDocument();
    expect(screen.getByText(/Total/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 60,00/)).toBeInTheDocument();
  });
});