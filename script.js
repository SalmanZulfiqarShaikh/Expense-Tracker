document.addEventListener('DOMContentLoaded', () => {
  const inputForm = document.getElementById("input-form");
  const expenseInput = document.getElementById("expense-input");
  const amountInput = document.getElementById("amount-input");
  const expenseList = document.getElementById("expense-list");
  const totalMessage = document.getElementById("total-message");
  const expenseHeading = document.getElementById("headexpense");

  expenseHeading.classList.add("hidden");
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  renderExpenses();
  updateTotal();

  inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const expense = expenseInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    if (expense !== "" && !isNaN(amount) && amount > 0) {
      const newExpense = {
        id: Date.now(),
        name: expense,
        amount: amount
      };

      expenses.push(newExpense);
      saveExpenses();
      renderExpenses();
      updateTotal();
    }

    expenseInput.value = "";
    amountInput.value = "";
  });

  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  function renderExpenses() {
    if (expenses.length > 0) {
      expenseHeading.classList.remove("hidden");
    } else {
      expenseHeading.classList.add("hidden");
    }

    expenseList.innerHTML = "";

    expenses.forEach(expense => {
      const expenseDiv = document.createElement("div");
      expenseDiv.classList.add("expense", "show");
      expenseDiv.innerHTML = `
        <span class="expense-name">${expense.name} - $${expense.amount}</span>
        <button class="remove-btn" data-id="${expense.id}">Remove</button>
      `;
      expenseList.appendChild(expenseDiv);
    });

    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", removeExpense);
    });
  }

  function removeExpense(e) {
    const idToRemove = Number(e.target.dataset.id);
    const index = expenses.findIndex(exp => exp.id === idToRemove);
    if (index !== -1) {
      expenses.splice(index, 1);
      saveExpenses();
      renderExpenses();
      updateTotal();
    }
  }

  function updateTotal() {
    const totalAmount = calculateTotal();
    if (totalAmount > 0) {
      totalMessage.classList.remove("hidden");
      totalMessage.innerHTML = `Total Expenses: $${totalAmount}`;
    } else {
      totalMessage.classList.add("hidden");
      totalMessage.innerHTML = "";
    }
  }

  function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

});
