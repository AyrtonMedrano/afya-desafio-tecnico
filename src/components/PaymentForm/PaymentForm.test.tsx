import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaymentForm } from './PaymentForm';

describe('PaymentForm', () => {
  it('renderiza títulos e labels principais', () => {
    render(
      <PaymentForm
        showInstallments
        onOpenInstallments={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(screen.getByText('Insira os dados de pagamento')).toBeInTheDocument();
    expect(screen.getByText('Bandeiras aceitas')).toBeInTheDocument();

    // Campos principais por placeholders
    expect(screen.getByPlaceholderText('0000 0000 0000 0000')).toBeInTheDocument(); // Número do cartão
    expect(screen.getByPlaceholderText('Preencha igual ao cartão')).toBeInTheDocument(); // Nome impresso
    expect(screen.getByPlaceholderText('MM/AA')).toBeInTheDocument(); // Validade
    expect(screen.getByPlaceholderText('000')).toBeInTheDocument(); // CVV
    expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument(); // CPF

    // Trigger de parcelas
    expect(
      screen.getByRole('button', { name: /Selecione o número de parcelas/i })
    ).toBeInTheDocument();
  });

  it('chama onOpenInstallments ao clicar no trigger de parcelas', async () => {
    const onOpenInstallments = jest.fn();

    render(
      <PaymentForm
        showInstallments
        onOpenInstallments={onOpenInstallments}
        onSubmit={() => {}}
      />
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Selecione o número de parcelas/i })
    );

    expect(onOpenInstallments).toHaveBeenCalledTimes(1);
  });

  it('exibe mensagens de erro ao submeter vazio', async () => {
    render(
      <PaymentForm
        showInstallments
        onOpenInstallments={() => {}}
        onSubmit={() => {}}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /Pagar/i }));

    // Deve exibir erros em múltiplos campos
    const errors = await screen.findAllByText('Campo obrigatório');
    expect(errors.length).toBeGreaterThanOrEqual(5);

    // O trigger de parcelas deve estar inválido
    const trigger = screen.getByRole('button', {
      name: /Selecione o número de parcelas/i,
    });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('submete com valores válidos e parcelas definidas', async () => {
    const onSubmit = jest.fn();

    const { container } = render(
      <PaymentForm
        showInstallments
        onOpenInstallments={() => {}}
        onSubmit={onSubmit}
      />
    );

    // Preencher campos
    await userEvent.type(
      screen.getByPlaceholderText('0000 0000 0000 0000'),
      '5555 4444 3333 2222'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Preencha igual ao cartão'),
      'John Doe'
    );
    await userEvent.type(screen.getByPlaceholderText('MM/AA'), '10/21');
    await userEvent.type(screen.getByPlaceholderText('000'), '123');
    await userEvent.type(screen.getByPlaceholderText('000.000.000-00'), '98765432100');

    // Atualiza o input hidden de installments, simulando escolha no offCanvas
    const hiddenInstallments = container.querySelector(
      'input[type="hidden"][name="installments"]'
    ) as HTMLInputElement;
    fireEvent.change(hiddenInstallments, { target: { value: '3' } });

    // Submeter
    await userEvent.click(screen.getByRole('button', { name: /Pagar/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      cardNumber: '5555 4444 3333 2222',
      nameOnCard: 'John Doe',
      expiry: '10/21',
      cvv: '123',
      cpf: '98765432100',
      installments: 3,
    });
  });
});