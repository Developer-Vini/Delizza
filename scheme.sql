CREATE TABLE IF NOT EXISTS pizzas (
    id      SERIAL PRIMARY KEY,
    nome    TEXT NOT NULL,
    descricao TEXT NOT NULL
    preco NUMERIC(8,2) NOT NULL,
    ativa   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pedidos (
    id      SERIAL PRIMARY KEY
    cliente TEXT NOT NULL
    telefone TEXT NOT NULL
    endereco    TEXT NOT NULL
    itens   JSONB NOT NULL
    total NUMERIC(8,2) NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO pizzas (nome, descricao, preco) VALUES
      ('Margherita',  'Molho de tomate, muçarela, manjericão fresco', 38.00),
  ('Calabresa',   'Calabresa fatiada, cebola roxa, muçarela',     42.00),
  ('Quatro queijos', 'Muçarela, provolone, gorgonzola, parmesão', 48.00),
  ('Frango com catupiry', 'Frango desfiado, catupiry, milho',     45.00),
  ('Portuguesa',  'Presunto, ovo, cebola, azeitona, muçarela',    46.00);
