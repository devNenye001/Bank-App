//THIS IS A BANKING SYSTEM CODE

class Transaction {
  constructor(type, amount) {
    this._type = type;
    this._amount = amount;
    this._timestamp = new Date();
  }

  get type() {
    return this._type;
  }

  get amount() {
    return this._amount;
  }

  get timestamp() {
    return this._timestamp;
  }

  getDetails() {
    return `${this.type} of ${
      this.amount
    } was made on ${this._timestamp.toLocaleString()}`;
  }
}

//ACCOUNT CLASS

class Account {
  constructor(accountNumber, balance, accountType, transactions = []) {
    this._accountNumber = accountNumber;
    this._balance = balance;
    this._accountType = accountType;
    this._transactions = transactions;
  }

  get accountNumber() {
    return this._accountNumber;
  }

  get balance() {
    return this._balance;
  }
  get accountType() {
    return this._accountType;
  }
  get transactions() {
    return this._transactions;
  }

  deposit(amount) {
    if (amount > 0 && typeof amount === "number") {
      this._balance += amount;

      const transaction = new Transaction("deposit", amount);

      this._transactions.push(transaction);

      alert(
        `Dear Customer, you have been credited ${amount.toLocaleString(
          "en-NG",
          { style: "currency", currency: "NGN" }
        )}. Your Current balance is ${this._balance.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        })}.`
      );
    } else {
      alert("Invaild deposit amount.");
    }
  }

  withdraw(amount) {
    if (amount > 0 && typeof amount === "number" && amount <= this._balance) {
      this._balance -= amount;

      const transaction = new Transaction("withdrawal", amount);

      this._transactions.push(transaction);

      alert(
        `Dear Customer, you have been debited ${amount.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        })}. Your Current balance is ${this._balance.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        })}.`
      );
    } else {
      alert("Insuff. AMOUNT.");
    }
  }

  getTransactionHistory() {
  const tbody = document.getElementById("tbody");

 
  if (this._transactions.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4"><b>No transactions made yet.</b></td>`;
    tbody.appendChild(row);
  } else {
    this._transactions.forEach((transaction, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${transaction.type}</td>
        <td>${transaction.amount.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        })}</td>
        <td>${transaction.timestamp.toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });
  }
}
}

//CUSTOMER CLASS
class Customer {
  constructor(name, address, accounts = []) {
    this._name = name;
    this._address = address;
    this._accounts = accounts;
  }

  set name(newName) {
    if (typeof newName === "string") {
      this._name = newName;
    } else {
      console.error("Enter a vaild name Bro");
    }
  }

  set address(newAddress) {
    if (typeof newAddress === "string") {
      this._address = newAddress;
    } else {
      console.error("Enter a vaild address Bro");
    }
  }

  get name() {
    return this._name;
  }

  get address() {
    return this._address;
  }

  get accounts() {
    return this._accounts;
  }

  //method of the customer
  addAccount(account) {
    if (account instanceof Account) {
      this._accounts.push(account);
      console.log(
        `Dear ${this.name}, You just added a ${account._accountType} Account.`
      );
    } else {
      console.error("Invalid account Object.");
    }
  }

  getDetails() {

    const details = document.querySelector(".details pre");

    details.textContent = `
NAME: ${this._name}
ADDRESS: ${this._address}`
  }
}

// INHERITANCE OF ACCOUNT CLASS
class SavingsAccount extends Account {
  constructor(accountNumber, balance, accountType, transactions = []) {
    super(accountNumber, balance, "savings", transactions);
    this._interestRate = 0.02;
    this._withdrawalLimit = 3;
    this._withdrawalsMade = 0;
  }

  get withdrawalsMade() {
    return `You have made ${this._withdrawalsMade} withdrawals.`;
  }

  calculateInterest() {
    const interest = this.balance * this._interestRate;
    const total = interest + this.balance;
    alert(`Dear Customer, your interest plus balance is: ${total}`);
  }

  withdraw(amount) {
    if (this._withdrawalsMade < this._withdrawalLimit) {
      super.withdraw(amount);
      this._withdrawalsMade++;
    } else {
      alert("You have reached your withdrawal limit");
    }
  }
}
class CheckingAccount extends Account {
  constructor(accountNumber, balance, accountType, transactions = []) {
    super(accountNumber, balance, "checking", transactions);
    this._overdraftLimit = -5000;
  }

  withdraw(amount) {
    if (this.balance - amount >= this._overdraftLimit) {
      super.withdraw(amount);
    } else {
      alert("Overdraft limit reached");
    }
  }
}

// const customer1 = new Customer("Chinenye", "Niger State", []);
// const account1 = new Account("0169606939", "10000", "savings", []);

// customer1.addAccount(account1);
// customer1.getDetails();
// account1.deposit(2000);
// account1.getTransactionHistory();

// screens
const loginPage = document.querySelector(".login");
const dashPage = document.querySelector(".dashboard");
const transPage = document.querySelector(".transaction-history");
const profilePage = document.querySelector(".profile-page");

// bank logic
// account number generation
function generateAccNumber() {
  return Math.floor(Math.random() * 10000000000);
}
console.log(generateAccNumber());

// form details
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));

  if (!data.FirstName || !data.Address || !data.AccountType) {
    window.alert("Please fill in the all the details.");
    return;
  } 
  const accNumber = generateAccNumber();

  //   create customer
  const customer1 = new Customer(data.FirstName, data.Address, []);
  let account1;

  if (data.AccountType === "Savings") {
    account1 = new SavingsAccount(accNumber, 0, data.AccountType, []);
  } else if (data.AccountType === "Checking") {
    account1 = new CheckingAccount(accNumber, 0, data.AccountType, []);
  } else {
    account1 = new Account(accNumber, 0, data.AccountType, []);
  }

  console.log(account1);
  showLogin(customer1, account1);
  deposit(account1);
  withdraw(account1);
  getTransactionHistory(account1);
  getProfileDetails(customer1, account1);
  getTransact(account1);
});

// show login page
function showLogin(customerDetails, account) {
  loginPage.style.display = "none";
  dashPage.style.display = "flex";

  const welcomeMsg = document.querySelector(".welcome");
  const accType = document.querySelector(".accTypeDisplay");
  const balance = document.querySelector(".balance");
  const accNo = document.querySelector(".accNo");

  welcomeMsg.textContent = `Welcome, ${customerDetails.name}`;
  accType.textContent = `Account Type: ${account.accountType}`;
  balance.textContent = `Balance: ${account.balance.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        })}`;
  accNo.innerHTML = `Account Number: <b>${account.accountNumber}</b>`


  console.log(customerDetails.name);
}

// deposit
function deposit(account){
    // DEPOSIT buttons
        const depositBtn = document.getElementById("deposit-btn");

        depositBtn.addEventListener("click", ()=>{
            const amount = Number(window.prompt("Enter the amount:"));
            account.deposit(amount);

            const balance = document.querySelector(".balance");
            balance.textContent = `Balance: ${account.balance.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        })}`;
        })
}

// withdaw
function withdraw(account){
    // WITHDRAW button
        const withdawBtn = document.getElementById("withdraw-btn");

        withdawBtn.addEventListener("click", ()=>{
            const amount = Number(window.prompt("Enter the amount:"));
            account.withdraw(amount);

            const balance = document.querySelector(".balance");
            balance.textContent = `Balance: ${account.balance.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        })}`;
        })
}

// Transaction history
function getTransactionHistory(account) {
  const transactionBtn = document.getElementById("transact-btn");

  transactionBtn.addEventListener("click", () => {
    account.getTransactionHistory();
    dashPage.style.display = "none";
    transPage.style.display = "flex";
  });
}


function getProfileDetails(customer, account) {

  // GET PROFILE DETAILS
  const profileBtn = document.getElementById("profile-btn");

  profileBtn.addEventListener("click", () => {
    customer.getDetails();
    dashPage.style.display = "none";
    profilePage.style.display = "flex";

    const details = document.querySelector(".details pre");

    details.textContent += `
ACCOUNT NUMBER: ${account.accountNumber}
CURRENCY: NGN`
  })
  
}

function goBackProfile(){

  profilePage.style.display = "none";
  dashPage.style.display = "flex";
}

function getTransact(account){

  const transact = document.getElementById("transact");

  transact.addEventListener("click", () => {
  account.getTransactionHistory();
  profilePage.style.display = "none";
  transPage.style.display = "flex";
  })
}

function goBackTransact(){

  transPage.style.display = "none";
  dashPage.style.display = "flex";
}