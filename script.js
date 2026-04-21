// Adicionamos a funcionalidade de data para parecer mais profissional
document.getElementById('current-date').innerText = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Por favor preencha os dados corretamente.');
        return;
    }

    const transaction = {
        id: Math.floor(Math.random() * 1000000),
        text: text.value,
        amount: parseFloat(amount.value)
    };

    transactions.push(transaction);
    updateUI();
    updateLocalStorage();
    form.reset();
}

function updateUI() {
    list.innerHTML = '';
    transactions.forEach(t => {
        const sign = t.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add('transaction-item');
        
        item.innerHTML = `
            <div>
                <strong>${t.text}</strong><br>
                <small style="color: #64748b">${new Date().toLocaleDateString()}</small>
            </div>
            <span style="color: ${t.amount < 0 ? 'var(--danger)' : 'var(--success)'}; font-weight: bold">
                ${sign} ${Math.abs(t.amount).toFixed(2)}€
                <button onclick="removeTransaction(${t.id})" style="border:none; background:none; cursor:pointer; margin-left:10px; color:#cbd5e1">
                    <i class="fas fa-trash"></i>
                </button>
            </span>
        `;
        list.appendChild(item);
    });

    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `${total}€`;
    moneyPlus.innerText = `+ ${income}€`;
    moneyMinus.innerText = `- ${expense}€`;
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    updateUI();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', addTransaction);
updateUI();
