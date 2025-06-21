let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chart;  // This will hold our chart instance

function addTransaction() {
  const desc = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);

  if (desc === '' || isNaN(amount)) {
    alert('Please enter valid data.');
    return;
  }

  const transaction = {
    id: Date.now(),
    desc,
    amount
  };

  transactions.push(transaction);
  saveAndRender();
  document.getElementById('desc').value = '';
  document.getElementById('amount').value = '';
}

function saveAndRender() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderTransactions();
  updateSummary();
}

function renderTransactions() {
  const list = document.getElementById('transactions');
  list.innerHTML = '';

  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.classList.add(tx.amount < 0 ? 'expense' : 'income');
    li.innerHTML = `${tx.desc}: ₹${tx.amount} 
      <button onclick="removeTransaction(${tx.id})" style="float:right;">❌</button>`;
    list.appendChild(li);
  });
}

function removeTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  saveAndRender();
}

function updateSummary() {
  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);

  document.getElementById('income').textContent = income;
  document.getElementById('expense').textContent = Math.abs(expense);
  document.getElementById('balance').textContent = income + expense;
  renderChart(income, expense);

}

function renderChart(income, expense) {
  const ctx = document.getElementById('financeChart').getContext('2d');

  // Agar chart already bana hua hai, to pehle usse hatao (destroy)
  if (chart) {
    chart.destroy();
  }

  // Naya chart banao
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, Math.abs(expense)],
        backgroundColor: ['#2ecc71', '#e74c3c'],  // Green and Red
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Income vs Expense'
        }
      }
    }
  });
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  document.getElementById('modeToggle').textContent = '☀️ Light Mode';
}

saveAndRender();

function toggleMode() {
  const body = document.body;
  const toggleBtn = document.getElementById('modeToggle');

  body.classList.toggle('dark');

  // Change button text/icon
  if (body.classList.contains('dark')) {
    toggleBtn.textContent = '☀️ Light Mode';
  } else {
    toggleBtn.textContent = '🌙 Dark Mode';
  }

  // Save preference to localStorage
  localStorage.setItem('darkMode', body.classList.contains('dark'));
}
