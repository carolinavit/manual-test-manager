# Manual Test Plans (inspirado no Azure DevOps)

Aplicação simples para **organização e execução de testes manuais**, com a hierarquia:

**Test Plan → Test Suite → Test Cases → Test Runs (histórico)**

## Visão rápida (para QA)

- **Test Plan**: “o que vamos testar” em um ciclo/release.
- **Test Suite**: “como organizamos” por área/feature (Login, Carrinho…).
- **Test Case**: “um cenário” com pré-condições, passos e resultado esperado.
- **Test Run**: “uma execução” do Test Case, com status e evidência (vira histórico).

## Estrutura do projeto

- `backend/`: API REST (Node.js + Express + Prisma + SQLite)
  - `src/routes`: URLs e métodos (REST)
  - `src/controllers`: valida entrada e traduz HTTP → regras
  - `src/services`: regras + acesso ao banco via Prisma
  - `prisma/`: schema, migrations e `seed.ts`
- `frontend/`: React + Vite
  - UI estilo “Test Plans” (simples): Plans, Runs, Dashboard

## Requisitos

- Node.js instalado (recomendado LTS)
- Windows (ok), macOS ou Linux

## Como rodar

### 1) Backend

Abra um terminal em `manual-test-manager/backend` e rode:

```bash
npm install
npx prisma migrate dev
npx prisma generate
npx prisma db seed
npm run dev
```

API sobe em `http://localhost:4000` (health em `GET /health`).

### 2) Frontend

Abra outro terminal em `manual-test-manager/frontend` e rode:

```bash
npm install
npm run dev
```

UI sobe em `http://localhost:5173`.

> Por padrão o frontend usa `http://localhost:4000/api`.
> Se quiser mudar, crie `frontend/.env` com:
>
> `VITE_API_URL=http://localhost:4000/api`

## Endpoints principais (API REST)

- **Test Plans**
  - `GET /api/test-plans?q=texto`
  - `POST /api/test-plans`
  - `GET /api/test-plans/:id?hierarchy=true`
  - `PATCH /api/test-plans/:id`
  - `DELETE /api/test-plans/:id`
- **Test Suites**
  - `POST /api/test-suites`
  - `GET /api/test-suites/:id`
  - `PATCH /api/test-suites/:id`
  - `DELETE /api/test-suites/:id`
  - `GET /api/test-plans/:testPlanId/test-suites`
- **Test Cases**
  - `POST /api/test-cases`
  - `GET /api/test-cases/:id`
  - `PATCH /api/test-cases/:id`
  - `DELETE /api/test-cases/:id`
  - `GET /api/test-suites/:testSuiteId/test-cases?q=texto`
- **Execuções (Test Runs)**
  - `POST /api/test-runs`
  - `GET /api/test-runs?status=Passed|Failed|Blocked`
  - `GET /api/test-cases/:testCaseId/test-runs`
- **Dashboard**
  - `GET /api/dashboard?testPlanId=...`

## Seed inicial

O seed cria um plano “Release 1.0 - Smoke”, com suites/cases e algumas execuções (Passed/Failed/Blocked).

