require('dotenv').config();
const express = require('express');
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
 });
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/pizzas', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT id, nome, descricao, preco FROM pizzas WHERE ativa = true ORDER BY id'
        );

        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: 'Não foi possivel recarregar o cardapio' });
    }
});

app.post('/api/pedidos', async (req, res) => {
    const { cliente, telefone, endereco, itens } = req.body || {};

    if (!cliente?.trim() || !telefone?.trim() || !endereco?.trim() || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ erro: 'Preencha o nome, telefone, endereco e escolha ao menos uma pizza' });
    }
    try {
        const ids = itens.map(i => Number(i.id));

        const { rows } = await pool.query(
            'SELECT id, nome, preco FROM pizzas WHERE ativa = true AND id = ANY($1::int[])', [ids]
        );

        const porId = new Map(rows.map(p => [p.id, p]));

        let total = 0;
        const linhas = [];

        for (const i of itens) {
            const p = porId.get(Number(i.id));
            const qtd = Math.min(Math.max(parseInt(i.qtd, 10) || 0, 0), 20);

            if (!p || qtd === 0) continue;
            total += Number(p.preco) * qtd
            linhas.push({ id: p.id, nome: p.nome, preco: Number(p.preco), qtd });
        }

        if (linhas.length === 0) return res.status(400).json({ erro: 'Itens invalidos' })

        const r = await pool.query(
            `INSERT INTO pedidos (cliente, telefone, endereco, itens, total)
            VALUES ($1,$2,$3,$4,$5) RETURNING id`,
            //[cliente.trim(), telefone.trim(), JSON.stringify(linhas),total]
            [cliente.trim(), telefone.trim(), endereco.trim(), JSON.stringify(linhas), total]
        );

        res.status(201).json({ id: r.rows[0].id, total });
    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: 'Não foi possivel enviar o pedido. Tente novamente' })
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Pizzaria rodando")
})
