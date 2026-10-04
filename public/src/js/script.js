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

        $('cardapio').innerHTML = pizzas.map(p => `
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

document.addEventListener('click', e => {
    const t = e.target;
    if(t.dataset.id) mudar(Number(t.dataset.id), 1);
    if(t.dataset.mais) mudar(Number(t.dataset.mais), 1);
    if(t.dataset.menos) mudar(Number(t.dataset.menos), -1)
})

$('enviar').addEventListener("click", async () => {
    const msg = $('msg');
    msg.className = ''; 
    msg.textContent = '';
    $('enviar').disabled = true;
    try{
        const r = await fetch('/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cliente: $('cliente').value, 
                telefone: $('telefone').value,
                endereco: $('endereco').value,
                itens: [...carrinho].map(([id, qtd]) => ({ id, qtd }))
            })
        });
        const d = await r.json();

        if(!r.ok){
            throw new Error(d.erro);
        }


        carrinho.clear();
        desenhar();
        msg.className = 'msg ok';
        msg.textContent = `Order #${d.id} sent! Total: ${brl(Number(d.total))}.`;
    }catch(err){
        msg.className = 'msg erro';
        msg.textContent = err.message || 'The request could not be sent.';
        $('enviar').disabled = carrinho.size === 0;
    }
})

carregar()