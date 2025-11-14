import { useMemo, useState } from 'react';
import { Drawer } from './Drawer';
import {
  Hint,
  List,
  Item,
  Radio,
  ItemTitle,
  ItemSub,
  DiscountBadge,
} from './InstallmentsDrawer.styled';

type InstallmentsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (installments: number) => void;
};

import { useCheckoutStore } from '../../store/useCheckoutStore';

export function InstallmentsDrawer({
  isOpen,
  onClose,
  onConfirm,
}: InstallmentsDrawerProps) {
  const options = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const [selected, setSelected] = useState<number | null>(null);
  const { prices } = useCheckoutStore();

  const formatBRL = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const round2 = (v: number) => Math.round(v * 100) / 100;

  const totalFor = (n: number) => round2(n === 1 ? prices.anual * 0.9 : prices.anual);
  const perInstallmentFor = (n: number) => round2(totalFor(n) / n);

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected);
    }
  };

  const handleSelect = (value: number) => setSelected(value);

  return (
    <Drawer
      isOpen={isOpen}
      title="Número de Parcelas"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmDisabled={!selected}
      confirmLabel="Confirmar"
      cancelLabel="Cancelar"
    >
      <Hint>
        Lembre-se, você precisa ter o <strong>valor total do plano</strong>  disponível no limite do
        cartão para realizar a compra.
      </Hint>

      <List>
        {options.map((n) => {
          const total = totalFor(n);
          const per = perInstallmentFor(n);
          return (
            <Item key={n} onClick={() => handleSelect(n)}>
              <Radio
                type="radio"
                name="installments"
                checked={selected === n}
                onChange={() => handleSelect(n)}
                aria-label={`${n}x`}
              />
              <div>
                <ItemTitle>
                  {n}x de {formatBRL(per)}{' '}
                  {n === 1 && <DiscountBadge>10% de desconto</DiscountBadge>}
                </ItemTitle>
                <ItemSub>
                  Total de {formatBRL(total)} — Sem juros
                </ItemSub>
              </div>
            </Item>
          );
        })}
      </List>
    </Drawer>
  );
}