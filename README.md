# API Vendas Jogos Digitais

API REST em TypeScript com NestJS, Drizzle ORM, PostgreSQL e [Bun](https://bun.sh).

## Stack

- NestJS
- TypeScript
- Drizzle ORM
- PostgreSQL
- JWT
- Bun

## Estrutura

```text
src/
  infra/database/
  modules/
    auth/
    categories/
    carts/
    companies/
    games/
    profiles/
    reports/
    reviews/
    sales/
    users/
    wishlist/
  shared/
  app.module.ts
  main.ts
migrations/
docs/
```

## Rotas preservadas

- `GET /check`
- `GET /api/v1/`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `PUT /api/v1/auth/change-password`
- `GET /api/v1/public/jogos`
- `GET /api/v1/empresas`
- `GET /api/v1/empresas/:id`
- `POST /api/v1/empresas`
- `PUT /api/v1/empresas/:id`
- `DELETE /api/v1/empresas/:id`
- `GET /api/v1/usuarios/:id`
- `GET /api/v1/usuarios`
- `GET /api/v1/usuarios/my/games`
- `PUT /api/v1/usuarios/:id`
- `GET /api/v1/profiles`
- `POST /api/v1/profiles`
- `GET /api/v1/jogos`
- `GET /api/v1/jogos/:id`
- `POST /api/v1/jogos`
- `PUT /api/v1/jogos/:id`
- `DELETE /api/v1/jogos/:id`
- `GET /api/v1/categorias`
- `GET /api/v1/categorias/:id`
- `GET /api/v1/carrinho`
- `GET /api/v1/carrinho/ativo`
- `POST /api/v1/carrinho/add`
- `DELETE /api/v1/carrinho/:gameId`
- `GET /api/v1/vendas`
- `POST /api/v1/vendas/checkout`
- `POST /api/v1/vendas/pay`
- `POST /api/v1/avaliacoes`
- `PUT /api/v1/avaliacoes`
- `GET /api/v1/avaliacoes`
- `GET /api/v1/avaliacoes/media/:jogoId`
- `GET /api/v1/lista-desejo`
- `POST /api/v1/lista-desejo`
- `DELETE /api/v1/lista-desejo`
- `GET /api/v1/relatorios/jogos-mais-vendidos`

`POST /api/v1/auth/forgot-password` foi mantida como rota adicional de compatibilidade com o frontend atual.

## Como rodar

1. Copie `.env.example` para `.env`.
2. Instale dependencias com `bun install`.
3. Rode as migracoes com `bun run db:migrate`.
4. Rode o seed inicial com `bun run db:seed`.
5. Suba a aplicacao com `bun run start:dev`.

## Scripts

- `bun run start:dev`
- `bun run build`
- `bun run start`
- `bun run db:generate`
- `bun run db:migrate`
- `bun run db:seed`

## Regras de negocio

O mapeamento consolidado esta em [docs/regras-de-negocio.md](./docs/regras-de-negocio.md).
