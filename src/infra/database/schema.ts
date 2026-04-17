import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const profilesTable = pgTable(
  'perfis',
  {
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 100 }).notNull(),
  },
  (table) => [uniqueIndex('perfis_nome_uidx').on(table.nome)],
);

export const usersTable = pgTable(
  'usuarios',
  {
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    senha: varchar('senha', { length: 255 }).notNull(),
    dataNascimento: timestamp('data_nascimento', {
      withTimezone: true,
      mode: 'date',
    }),
    fkPerfil: integer('fk_perfil')
      .notNull()
      .references(() => profilesTable.id, { onDelete: 'restrict' }),
  },
  (table) => [uniqueIndex('usuarios_email_uidx').on(table.email)],
);

export const categoriesTable = pgTable(
  'categorias',
  {
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull(),
  },
  (table) => [uniqueIndex('categorias_nome_uidx').on(table.nome)],
);

export const companiesTable = pgTable(
  'empresas',
  {
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull(),
  },
  (table) => [uniqueIndex('empresas_nome_uidx').on(table.nome)],
);

export const gamesTable = pgTable(
  'jogos',
  {
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull(),
    ano: integer('ano').notNull(),
    preco: numeric('preco', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    desconto: numeric('desconto', { precision: 5, scale: 2, mode: 'number' }).default(0),
    descricao: text('descricao'),
    fkEmpresa: integer('fk_empresa')
      .notNull()
      .references(() => companiesTable.id, { onDelete: 'restrict' }),
    fkCategoria: integer('fk_categoria')
      .notNull()
      .references(() => categoriesTable.id, { onDelete: 'restrict' }),
  },
  (table) => [unique('jogos_nome_empresa_unique').on(table.nome, table.fkEmpresa)],
);

export const salesTable = pgTable('vendas', {
  id: serial('id').primaryKey(),
  fkUsuario: integer('fk_usuario')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'restrict' }),
  valorTotal: numeric('valor_total', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  quantidade: integer('quantidade').notNull(),
  data: timestamp('data', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const cartsTable = pgTable('carrinhos', {
  id: serial('id').primaryKey(),
  fkUsuario: integer('fk_usuario')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'restrict' }),
  fkVenda: integer('fk_venda').references(() => salesTable.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 1 }).notNull().default('A'),
});

export const cartItemsTable = pgTable(
  'itens_carrinho',
  {
    id: serial('id').primaryKey(),
    fkJogo: integer('fk_jogo')
      .notNull()
      .references(() => gamesTable.id, { onDelete: 'restrict' }),
    fkCarrinho: integer('fk_carrinho')
      .notNull()
      .references(() => cartsTable.id, { onDelete: 'cascade' }),
    chaveAtivacao: varchar('chave_ativacao', { length: 64 }),
  },
  (table) => [unique('itens_carrinho_carrinho_jogo_unique').on(table.fkCarrinho, table.fkJogo)],
);

export const reviewsTable = pgTable(
  'avaliacoes',
  {
    id: serial('id').primaryKey(),
    fkUsuario: integer('fk_usuario')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    fkJogo: integer('fk_jogo')
      .notNull()
      .references(() => gamesTable.id, { onDelete: 'restrict' }),
    nota: integer('nota').notNull(),
    comentario: text('comentario'),
    data: timestamp('data', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    unique('avaliacoes_usuario_jogo_unique').on(table.fkUsuario, table.fkJogo),
    check('avaliacoes_nota_check', sql`${table.nota} BETWEEN 1 AND 5`),
  ],
);

export const wishlistTable = pgTable(
  'lista_desejos',
  {
    id: serial('id').primaryKey(),
    fkUsuario: integer('fk_usuario')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    fkJogo: integer('fk_jogo')
      .notNull()
      .references(() => gamesTable.id, { onDelete: 'restrict' }),
  },
  (table) => [unique('lista_desejos_usuario_jogo_unique').on(table.fkUsuario, table.fkJogo)],
);

export const schema = {
  profilesTable,
  usersTable,
  categoriesTable,
  companiesTable,
  gamesTable,
  salesTable,
  cartsTable,
  cartItemsTable,
  reviewsTable,
  wishlistTable,
};
