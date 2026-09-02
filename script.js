let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;

const form = document.getElementById("transactionForm");

const type = document.getElementById("type");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");

const transactionList = document.getElementById("transactionList");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");

const filter = document.getElementById("filter");

const submitBtn = document.getElementById("submitBtn");


// Add Transaction

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const transaction = {
        id: Date.now(),
        type: type.value,
        title: title.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value
    };


    // Edit transaction

    if (editId !== null) {

        transactions = transactions.map(function(item) {

            if (item.id === editId) {
                return {
                    id: editId,
                    type: type.value,
                    title: title.value,
                    amount: Number(amount.value),
                    category: category.value,
                    date: date.value
                };
            }

            return item;
        });

        editId = null;

        submitBtn.innerText = "Add Transaction";

    } else {

        transactions.push(transaction);

    }


    saveData();

    form.reset();

    displayTransactions();

});


// Save data in Local Storage

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// Display Transactions

function displayTransactions() {

    transactionList.innerHTML = "";

    let selectedCategory = filter.value;

    let filteredTransactions = transactions;

    if (selectedCategory !== "all") {

        filteredTransactions = transactions.filter(function(item) {

            return item.category === selectedCategory;

        });

    }


    if (filteredTransactions.length === 0) {

        transactionList.innerHTML =
            `<div class="empty">No transactions found</div>`;

        updateSummary();

        return;
    }


    filteredTransactions.forEach(function(item) {

        const div = document.createElement("div");

        div.className = "transaction";


        let sign = item.type === "income" ? "+" : "-";

        let amountClass =
            item.type === "income" ? "income" : "expense";


        div.innerHTML = `

            <div class="transaction-info">

                <h3>${item.title}</h3>

                <p>
                    ${item.category} |
                    ${item.date}
                </p>

            </div>


            <div class="transaction-right">

                <div class="amount ${amountClass}">
                    ${sign} ₹${item.amount}
                </div>

                <div class="actions">

                    <button
                        class="edit-btn"
                        onclick="editTransaction(${item.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${item.id})">
                        Delete
                    </button>

                </div>

            </div>

        `;


        transactionList.appendChild(div);

    });


    updateSummary();

}


// Update Summary

function updateSummary() {

    let income = 0;
    let expense = 0;


    transactions.forEach(function(item) {

        if (item.type === "income") {

            income = income + item.amount;

        } else {

            expense = expense + item.amount;

        }

    });


    let currentBalance = income - expense;


    totalIncome.innerText = "₹" + income;

    totalExpense.innerText = "₹" + expense;

    balance.innerText = "₹" + currentBalance;

}


// Delete Transaction

function deleteTransaction(id) {

    transactions = transactions.filter(function(item) {

        return item.id !== id;

    });


    saveData();

    displayTransactions();

}


// Edit Transaction

function editTransaction(id) {

    const transaction = transactions.find(function(item) {

        return item.id === id;

    });


    if (!transaction) {
        return;
    }


    type.value = transaction.type;

    title.value = transaction.title;

    amount.value = transaction.amount;

    category.value = transaction.category;

    date.value = transaction.date;


    editId = id;

    submitBtn.innerText = "Update Transaction";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Category Filter

filter.addEventListener("change", function() {

    displayTransactions();

});


// Initial display

displayTransactions();
