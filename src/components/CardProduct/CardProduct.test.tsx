import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals'
import userEvent from '@testing-library/user-event';
import CardProduct from './CardProduct';

const defaultProps = {
  title: 'Anual',
  price: 630,
  pricePer: 'ano',
  description: 'Pagamento à vista ou R$ 700,00 até 12x',
  isSelected: false,
  onSelect: jest.fn(),
};

describe('CardProduct', () => {
  it('renders correctly with default props', () => {
    render(<CardProduct {...defaultProps} />);

    expect(screen.getByText('Anual')).toBeInTheDocument();
    expect(screen.getByText('R$ 630,00')).toBeInTheDocument();
    expect(screen.getByText('/ano')).toBeInTheDocument();
    expect(
      screen.getByText('Pagamento à vista ou R$ 700,00 até 12x')
    ).toBeInTheDocument();
    expect(screen.queryByText('Melhor oferta')).not.toBeInTheDocument();
  });

  it('shows "Melhor oferta" badge when bestOffer is true', () => {
    render(<CardProduct {...defaultProps} bestOffer />);

    expect(screen.getByText('Melhor oferta')).toBeInTheDocument();
  });

  it('calls onSelect when the card is clicked', async () => {
    const onSelectMock = jest.fn();
    render(<CardProduct {...defaultProps} onSelect={onSelectMock} />);

    await userEvent.click(screen.getByText('Anual'));

    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });

  it('shows as selected when isSelected is true', () => {
    render(<CardProduct {...defaultProps} isSelected />);

    const radio = screen.getByRole('radio');
    expect(radio).toBeChecked();
  });
});