require('dotenv').config();
const express = require('express');
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/api/pizzas', async (req, res) => {
    try{
        const { rows } = await pool.query(
            'SELECT id, nome, descricao, preco FROM pizzas WHERE ativa ORDER BY id'
        );
        
        res.json(rows);
    }catch(e){
        console.error(e);
        res.status(500).json({ erro: 'Não foi possivel recarregar o cardapio'});
    }
});
