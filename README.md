# Whitebook Checkout

Desafio técnico para a vaga de Desenvolvedor Frontend - Ayrton Medrano

Caro examinador, busquei ao máximo utilizar as tecnologias citadas no escopo do teste, neste código você irá encontrar testes unitários, de integração e e2e.

Utilizei styled components em componentes modulares e CSS modules nas páginas de layout, busquei utilizar os dois para melhores fins de avaliação.

Espero que gostem, custou uma semana de noites mal dormidas rs.

No mais, qualquer dúvida fico a disposição via celular ou e-mail.

Ayton Medrano
+55 (11)96694-9707
mrayrtonmedrano@gmail.com

## Deploy

Frontend - https://afya-ayrton-medrano.vercel.app/
Backend - https://afya-desafio-tecnico.onrender.com
Monitoramento do backend (Robô) - https://dashboard.uptimerobot.com/monitors

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
- O plano mensal não possui aplicação para cupom de desconto.
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


## Estrutura (resumo)
- `src/components` — UI: PaymentForm, Summary, Drawer, etc.
- `src/pages` — páginas: Checkout, Success
- `src/store` — Zustand store e testes
- `src/services` — chamadas de API
- `src/types` — tipos TypeScript
- `server.cjs` — servidor local (json-server custom)
- `db.json` — dados (plans, coupons, subscriptions)
