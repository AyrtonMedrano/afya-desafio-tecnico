# Whitebook Checkout

Fluxo completo de checkout para assinatura do Whitebook, com foco em arquitetura clara, confiabilidade e excelente UX.

## Visão Geral
- Front-end em React + TypeScript (Vite).
- Estado global com Zustand.
- Formulários com react-hook-form e validação com Zod.
- API local via json-server customizado.
- Testes unitários/integrados (Jest + Testing Library) e E2E (Playwright).
- Estilos com CSS Modules e Styled Components no mesmo projeto, demonstrando proficiência em ambos.

## Processo e Metodologia
- TDD como norte: comecei pelos testes (cálculo de preços, regra de desconto no anual 1x, cupom, sincronização de parcelas), depois implementei a solução mínima para passar e refinei.
- Segui as tecnologias sugeridas no escopo do teste, garantindo aderência e cobrindo o fluxo fim a fim.

## Tecnologias Principais
- Build/Dev: `Vite`, `TypeScript`, `React`
- Estado: `Zustand`
- Formulário e validação: `react-hook-form`, `zod`
- Estilos: `CSS Modules`, `styled-components`
- Testes: `Jest`, `@testing-library/react`, `Playwright`
- API: `json-server` com endpoints customizados
- Qualidade: `ESLint`, `Prettier`, `tsconfig` strict

## Arquitetura
- `pages/Checkout/CheckoutPage.tsx`: orquestra o fluxo, busca planos e cria assinatura.
- `components/PaymentForm/PaymentForm.tsx`: captura, formata e valida dados do cartão (número, validade, CPF, bandeira).
- `components/Summary/Summary.tsx`: exibe subtotal/descontos/total/parcelas e aplica/remove cupom.
- `components/Drawer/InstallmentsDrawer.tsx`: seleção de parcelas com destaque para desconto anual à vista.
- `store/useCheckoutStore.ts`: estado central (plano, preços, parcelas, cupom) e cálculos (`subtotal`, `discount`, `total`).
- `services/api.ts`: integração com endpoints.
- `server.cjs`: API local com regras de preço/cupom e persistência em `db.json`.

## Regras de Negócio
- Anual 1x recebe 10% de desconto; cupom adicional aplica percentual sobre o preço anual.
- Ao alterar o plano (mensal/anual), as parcelas resetam para 1x e são refletidas em formulário, resumo e drawer.
- `SuccessPage` consulta a assinatura por `userId` e exibe dados contratados.

## Estilo: CSS Modules + Styled Components
- CSS Modules nos componentes e páginas onde o escopo estético é mais direto (PaymentForm, Summary).
- Styled Components para o Drawer e subcomponentes, explorando composição e temas. A convivência mostra domínio prático das duas abordagens.

## Execução
Instalação:
```bash
npm install
```

Servidor da API:
```bash
node server.cjs
```

Aplicação:
```bash
npm run dev
```

- `VITE_API_BASE_URL` (opcional) pode apontar para uma API diferente; sem definir, usa `http://localhost:3000`.

## Testes
Unit/integração:
```bash
npm test
```

E2E (CLI):
```bash
npm run e2e
```

E2E (UI Runner):
```bash
npm run e2e:ui
```

## Build e Preview
Build:
```bash
npm run build
```

Preview:
```bash
npm run preview
```

## Deploy
- Preparado para Vercel. Configure `VITE_API_BASE_URL` no ambiente para usar uma API válida.
- A build usa `tsc -b && vite build` com `strict` e regras de não uso para segurança de produção.

## Estrutura (resumo)
- `src/components` — UI: PaymentForm, Summary, Drawer, etc.
- `src/pages` — páginas: Checkout, Success
- `src/store` — Zustand store e testes
- `src/services` — chamadas de API
- `src/types` — tipos TypeScript
- `server.cjs` — servidor local (json-server custom)
- `db.json` — dados (plans, coupons, subscriptions)

## Decisões e Próximos Passos
- `tsconfig` com `strict` e `noUnusedLocals/Parameters` para código limpo e previsível.
- Utils de formatação isolados para testabilidade.
- Evolução futura: API real para produção, observabilidade, melhorias de acessibilidade.
