CREATE TABLE IF NOT EXISTS perfis (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  data_nascimento TIMESTAMPTZ,
  fk_perfil INTEGER NOT NULL REFERENCES perfis(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS empresas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS jogos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  ano INTEGER NOT NULL,
  preco NUMERIC(10, 2) NOT NULL,
  desconto NUMERIC(5, 2) DEFAULT 0,
  descricao TEXT,
  fk_empresa INTEGER NOT NULL REFERENCES empresas(id) ON DELETE RESTRICT,
  fk_categoria INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  CONSTRAINT jogos_nome_empresa_unique UNIQUE (nome, fk_empresa)
);

CREATE TABLE IF NOT EXISTS vendas (
  id SERIAL PRIMARY KEY,
  fk_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  valor_total NUMERIC(10, 2) NOT NULL,
  quantidade INTEGER NOT NULL,
  data TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS carrinhos (
  id SERIAL PRIMARY KEY,
  fk_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  fk_venda INTEGER REFERENCES vendas(id) ON DELETE SET NULL,
  status VARCHAR(1) NOT NULL DEFAULT 'A'
);

CREATE UNIQUE INDEX IF NOT EXISTS carrinhos_usuario_ativo_uidx
  ON carrinhos (fk_usuario)
  WHERE status = 'A';

CREATE TABLE IF NOT EXISTS itens_carrinho (
  id SERIAL PRIMARY KEY,
  fk_jogo INTEGER NOT NULL REFERENCES jogos(id) ON DELETE RESTRICT,
  fk_carrinho INTEGER NOT NULL REFERENCES carrinhos(id) ON DELETE CASCADE,
  chave_ativacao VARCHAR(64),
  CONSTRAINT itens_carrinho_carrinho_jogo_unique UNIQUE (fk_carrinho, fk_jogo)
);

CREATE TABLE IF NOT EXISTS avaliacoes (
  id SERIAL PRIMARY KEY,
  fk_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  fk_jogo INTEGER NOT NULL REFERENCES jogos(id) ON DELETE RESTRICT,
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT avaliacoes_usuario_jogo_unique UNIQUE (fk_usuario, fk_jogo)
);

CREATE TABLE IF NOT EXISTS lista_desejos (
  id SERIAL PRIMARY KEY,
  fk_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  fk_jogo INTEGER NOT NULL REFERENCES jogos(id) ON DELETE RESTRICT,
  CONSTRAINT lista_desejos_usuario_jogo_unique UNIQUE (fk_usuario, fk_jogo)
);

