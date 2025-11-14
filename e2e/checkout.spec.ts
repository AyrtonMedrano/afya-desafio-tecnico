import { test, expect } from '@playwright/test';

test('Fluxo feliz anual 1x até sucesso', async ({ page }) => {
  await page.route('http://localhost:3000/plans', async (route) => {
    const plans = [
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
    ];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(plans) });
  });

  await page.route('http://localhost:3000/coupons', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await page.route('http://localhost:3000/coupon/validate', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false }) });
  });

  
  await page.route('http://localhost:3000/subscription', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.goto('/checkout');

  await expect(page.getByText(/^Mensal$/)).toBeVisible();
  await expect(page.getByText(/^Anual$/)).toBeVisible();

  // Simula clique no texto do card
  await page.getByText(/^Anual$/).click();

  // Localiza o botão de parcelas dentro do label correspondente
  const installmentsField = page.locator('label:has-text("Número de parcelas")');
  await expect(installmentsField).toBeVisible({ timeout: 10000 });

  const installmentsTrigger = installmentsField.getByRole('button');
  await expect(installmentsTrigger).toBeVisible();
  await installmentsTrigger.click();

  // Drawer: selecionar 1x e confirmar 
  const drawer = page.getByRole('dialog', { name: /Número de Parcelas/i });
  await expect(drawer).toBeVisible();

  await drawer.getByRole('radio', { name: '1x', exact: true }).check();
  await drawer.getByRole('button', { name: /Confirmar/i }).click();

  // Preenchimento de dados válidos
  await page.getByLabel('Nome impresso no cartão').fill('John Doe');
  await page.getByLabel('Número do cartão').fill('4111 1111 1111 1111');
  await page.getByLabel('Validade').fill('12/29');
  await page.getByLabel('Código de segurança').fill('123');
  await page.getByLabel('CPF do portador do cartão').fill('98765432100');

  // Finalizar e verificar navegação
  await page.getByRole('button', { name: /Finalizar Compra/i }).click();
  await expect(page).toHaveURL(/\/success\/\d+$/);
});