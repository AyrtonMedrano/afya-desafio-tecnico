import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstallmentsDrawer } from './InstallmentsDrawer';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import { jest } from '@jest/globals';

describe('InstallmentsDrawer', () => {
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

  it('exibe valores calculados e badge de desconto em 1x', () => {
    render(<InstallmentsDrawer isOpen={true} onClose={() => {}} onConfirm={() => {}} />);
    expect(screen.getByText(/1x de R\$ 630,00/i)).toBeInTheDocument();
    expect(screen.getByText(/10% de desconto/i)).toBeInTheDocument();
    expect(screen.getByText(/2x de R\$ 350,00/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Total de R\$ 700,00/i).length).toBeGreaterThan(0);
  });

  it('habilita confirmar após seleção e envia o número', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    render(<InstallmentsDrawer isOpen={true} onClose={() => {}} onConfirm={onConfirm} />);

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    expect(confirmButton).toBeDisabled();

    await user.click(screen.getByLabelText('4x'));
    expect(confirmButton).not.toBeDisabled();

    await user.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledWith(4);
  });
});