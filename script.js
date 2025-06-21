let transactions = [];
let chart;

function addTransaction() {
  const desc = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  if (!desc || isNaN(amount) || !category) return;
  transactions.push({ desc, amount, category });
  document.getElementById('desc').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').selectedIndex = 0;
  showToast('Transaction added ✅');
  saveAndRender();
}

function saveAndRender() {
  renderTransactions();
  updateSummary();
}

function renderTransactions() {
  const list = document.getElementById('transactions');
  list.innerHTML = '';
  transactions.forEach((tx, index) => {
    const li = document.createElement('li');
    li.classList.add(tx.amount >= 0 ? 'income' : 'expense');
    li.innerHTML = `${tx.desc} - ₹${tx.amount} <small>[${tx.category}]</small>`;
    list.appendChild(li);
  });
  document.getElementById('txCount').innerText = `Transactions: ${transactions.length}`;
}

function updateSummary() {
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
  const balance = income + expense;
  document.getElementById('income').innerText = income;
  document.getElementById('expense').innerText = Math.abs(expense);
  document.getElementById('balance').innerText = balance;
  renderChart(income, expense);
}

function renderChart(income, expense) {
  const canvas = document.getElementById('financeChart');
  if (income === 0 && Math.abs(expense) === 0) {
    canvas.style.display = 'none';
    return;
  } else {
    canvas.style.display = 'block';
  }
  const ctx = canvas.getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, Math.abs(expense)],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Income vs Expense' }
      }
    }
  });
}

function toggleMode() {
  document.body.classList.toggle('dark');
}

function changeTheme(color) {
  document.documentElement.style.setProperty('--main-color', color);
}

function exportCSV() {
  if (transactions.length === 0) return;
  let csv = 'Description,Amount,Category\n';
  transactions.forEach(t => {
    csv += `${t.desc},${t.amount},${t.category}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'transactions.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function searchTransactions() {
  const search = document.getElementById('search').value.toLowerCase();
  const list = document.getElementById('transactions');
  list.innerHTML = '';
  transactions.forEach(tx => {
    if (tx.desc.toLowerCase().includes(search)) {
      const li = document.createElement('li');
      li.classList.add(tx.amount >= 0 ? 'income' : 'expense');
      li.innerHTML = `${tx.desc} - ₹${tx.amount} <small>[${tx.category}]</small>`;
      list.appendChild(li);
    }
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

window.onload = () => {
  saveAndRender();
};
