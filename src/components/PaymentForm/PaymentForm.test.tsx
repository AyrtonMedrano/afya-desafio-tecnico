import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { act } from 'react';
import { createRef } from 'react';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import { PaymentForm } from './PaymentForm';
import type { PaymentFormRef } from './PaymentForm';

describe('PaymentForm', () => {
  beforeEach(() => {
    useCheckoutStore.setState({ selectedPlan: 'anual' });
  });

  it('renderiza títulos e labels principais', () => {
    render(
      <PaymentForm
        onOpenInstallments={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(screen.getByText('Bandeiras aceitas')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('0000 0000 0000 0000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Preencha igual ao cartão')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/AA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Número de parcelas/i })
    ).toBeInTheDocument();

    expect(screen.getByText('Selecione o número de parcelas')).toBeInTheDocument();
  });

  it('chama onOpenInstallments ao clicar no trigger de parcelas', async () => {
    const onOpenInstallments = jest.fn();

    render(
      <PaymentForm
        onOpenInstallments={onOpenInstallments}
        onSubmit={() => {}}
      />
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Número de parcelas/i })
    );

    expect(onOpenInstallments).toHaveBeenCalledTimes(1);
  });

  it('exibe mensagens de erro ao submeter vazio', async () => {
    const { container } = render(
      <PaymentForm
        onOpenInstallments={() => {}}
        onSubmit={() => {}}
      />
    );

    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('0000 0000 0000 0000')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByPlaceholderText('Preencha igual ao cartão')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByPlaceholderText('MM/AA')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByPlaceholderText('000')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByPlaceholderText('000.000.000-00')).toHaveAttribute('aria-invalid', 'true');
      expect(
        screen.getByRole('button', { name: /Número de parcelas/i })
      ).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('submete com valores válidos e parcelas definidas', async () => {
    const onSubmit = jest.fn();
    const ref = createRef<PaymentFormRef>();

    render(
      <PaymentForm
        ref={ref}
        onOpenInstallments={() => {}}
        onSubmit={onSubmit}
      />
    );

    await userEvent.type(
      screen.getByPlaceholderText('0000 0000 0000 0000'),
      '4111 1111 1111 1111'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Preencha igual ao cartão'),
      'John Doe'
    );
    await userEvent.type(screen.getByPlaceholderText('MM/AA'), '12/29');
    await userEvent.type(screen.getByPlaceholderText('000'), '123');
    await userEvent.type(screen.getByPlaceholderText('000.000.000-00'), '98765432100');

    await act(async () => {
      ref.current?.setInstallments(3);
    });

    await act(async () => {
      ref.current?.submit();
    });

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      cardNumber: '4111 1111 1111 1111',
      nameOnCard: 'John Doe',
      expiry: '12/29',
      cvv: '123',
      cpf: '987.654.321-00',
      installments: 3,
    });
  });
});