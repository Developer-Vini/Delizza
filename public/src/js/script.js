const brl = n => n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

const $ = id => document.getElementById(id)

let pizzas = [];


const carrinho = new Map();

async function carregar() {
    try {
        const r = await fetch('/api/pizzas');

        if (!r.ok) {
            throw new Error();
        }

        pizzas = await r.json();

        $('menu').innerHTML = pizzas.map(p => `
            <div class="pizza">
                <div><h3>${p.nome}</h3><p>${p.descricao}</p></div>
                <div style="text-align:right">
                    <div class="preco">${brl(Number(p.preco))}</div>
                    <button class="add" data-id="${p.id}">Add</button>
                </div>
            </div>`).join('');
    } catch {
        $('cardapio').innerHTML = '<p class="msg erro">The menu could not be loaded. Check your connection to the bank.</p> '
    }
}

function mudar(id, delta) {
    const q = (carrinho.get(id) || 0) + delta;
    q <= 0 ? carrinho.delete(id) : carrinho.set(id, q);
    desenhar();
}

function desenhar() {
    let total = 0;
    const html = [...carrinho].map(([id, q]) => {
        const p = pizzas.find(x => x.id === id);
        total += Number(p.preco) * q;

        return `<div class="item"><span>${p.nome}</span>
      <span class="qtd"><button data-menos="${id}" aria-label="Remove one">−</button><span>${q}</span><button data-mais="${id}" aria-label="add one">+</button></span></div>`;
    }).join('');
    $('carrinho').innerHTML = html || '<p class="vazio">Add a pizza from the menu.</p>';
    $('total').textContent = brl(total);
    $('enviar').disabled = carrinho.size === 0;
}
