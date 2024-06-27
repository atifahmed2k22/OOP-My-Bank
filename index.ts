#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

// Customer Class
class Customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  accountNumber: number;
  constructor(
    fName: string,
    lName: string,
    age: number,
    gender: string,
    phone: string,
    acc: number
  ) {
    this.firstName = fName;
    this.lastName = lName;
    this.age = age;
    this.gender = gender;
    this.phoneNumber = phone;
    this.accountNumber = acc;
  }
}

// Interface BankAccount
interface BankAccount {
  accountNumber: number;
  balance: number;
}

// Class Bank
class Bank {
  customers: Customer[] = [];
  accounts: BankAccount[] = [];
  addCustomer(obj: Customer) {
    this.customers.push(obj);
  }
  addAccountNumber(obj: BankAccount) {
    this.accounts.push(obj);
  }
  transaction(accObj: BankAccount) {
    this.accounts = this.accounts.map((acc) =>
      acc.accountNumber === accObj.accountNumber ? accObj : acc
    );
  }
}

let myBank = new Bank();

// Generate random phone number
function generatePhoneNumber() {
  let num = "3";
  for (let i = 0; i < 9; i++) {
    num += Math.floor(Math.random() * 10).toString();
  }
  return num;
}

// Arrays for first names and last names
const firstNames = ["Naveed", "Hamza", "Ayesha", "Sana", "Asif"];
const lastNames = ["Dawood", "Junaid", "Altaf", "Hanif", "Salman"];

// Customer Create
for (let i = 1; i <= 3; i++) {
  let fName = firstNames[Math.floor(Math.random() * firstNames.length)];
  let lName = lastNames[Math.floor(Math.random() * lastNames.length)];
  let num = generatePhoneNumber();
  const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
  myBank.addCustomer(cus);
  myBank.addAccountNumber({
    accountNumber: cus.accountNumber,
    balance: 100 * i,
  });
}

// Bank Functionality
async function bankService(bank: Bank) {
  let exit = false;
  while (!exit) {
    let service = await inquirer.prompt({
      type: "list",
      name: "select",
      message: "Select an option",
      choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
    });

    // View Balance
    if (service.select === "View Balance") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Enter your account number:",
      });
      let account = myBank.accounts.find(
        (acc) => acc.accountNumber === parseInt(res.num)
      );
      if (!account) {
        console.log(chalk.bold.red.italic("Account not found"));
      } else {
        let name = myBank.customers.find(
          (item) => item.accountNumber === account.accountNumber
        );
        console.log(
          `Dear ${chalk.bold.green.italic(
            name?.firstName
          )} ${chalk.bold.green.italic(
            name?.lastName
          )}, Your Account Balance is ${chalk.bold.italic.blue(
            `$${account.balance}`
          )}`
        );
      }
    }

    // Cash Withdraw
    if (service.select === "Cash Withdraw") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Enter your account number:",
      });
      let account = myBank.accounts.find(
        (acc) => acc.accountNumber === parseInt(res.num)
      );
      if (!account) {
        console.log(chalk.bold.red.italic("Account not found"));
      } else {
        let ans = await inquirer.prompt({
          type: "number",
          name: "rupees",
          message: "Enter the amount to withdraw:",
        });
        if (ans.rupees > account.balance) {
          console.log(chalk.bold.red.italic("Insufficient Balance"));
        } else {
          let newBalance = account.balance - ans.rupees;
          // Transaction method
          bank.transaction({
            accountNumber: account.accountNumber,
            balance: newBalance,
          });
          console.log(chalk.bold.green.italic("Transaction successful"));
        }
      }
    }

    // Cash Deposit
    if (service.select === "Cash Deposit") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Enter your account number:",
      });
      let account = myBank.accounts.find(
        (acc) => acc.accountNumber === parseInt(res.num)
      );
      if (!account) {
        console.log(chalk.bold.red.italic("Account not found"));
      } else {
        let ans = await inquirer.prompt({
          type: "number",
          name: "rupees",
          message: "Please enter your amount:",
        });
        let newBalance = account.balance + ans.rupees;
        // Transaction method
        bank.transaction({
          accountNumber: account.accountNumber,
          balance: newBalance,
        });
        console.log(chalk.bold.green.italic("Transaction successful"));
      }
    }

    // Exit
    if (service.select === "Exit") {
      console.log("Exiting the program...");
      exit = true;
    }
  }
}

bankService(myBank);
