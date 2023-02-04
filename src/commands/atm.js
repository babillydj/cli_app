#!/usr/bin/env node


import promptSync from "prompt-sync"
const prompt = promptSync({sigint: true})

import { atmController } from "../controller/atm.js";

console.clear()
console.log("Welcome to Katalis ATM")
console.log("Type 'login <your-username>' to start")
console.log()


let guess = ""
let loggedAs = ""
while (guess !== "exit") {
    guess = prompt('');

    const inputs = guess.split(" ")
    const command = inputs.shift()
    if (!loggedAs && command !== "login" && command !== "exit") {
        console.log("please login first")
    } else {
        switch (command) {
            case "login":
                if (loggedAs) {
                    console.log("You are still logged in as " + loggedAs)
                    console.log("type 'logout' if you want to change account")
                } else {
                    loggedAs = inputs.join(" ")
                    const resp = await atmController.login(loggedAs)

                    console.log(`Hello, ${resp.name}!`)
                    console.log(`Your Balance Is $${resp.balance}`)
                    for (const row of resp.debts.rows) {
                        console.log(`You owed $${row.doc.amount} to ${row.doc.lender}`)
                    }
                    for (const row of resp.receivables) {
                        console.log(`${row.doc.borrower} owed $${row.doc.amount} to you`)
                    }
                }
                break

            case "info":
                const resp = atmController.getInfo()

                console.log(`Your Balance Is $${resp.balance}`)
                for (const row of resp.debts.rows) {
                    console.log(`You owed $${row.doc.amount} to ${row.doc.lender}`)
                }
                for (const row of resp.receivables) {
                    console.log(`${row.doc.borrower} owed $${row.doc.amount} to you`)
                }
                break

            case "deposit":
                let deposit = inputs.pop().replace("/./g","")
                            .replace("/,/g","")

                deposit = parseInt(deposit)
                if (isNaN(deposit)) {
                    console.log("Please enter the right amount")
                } else {
                    const resp = await atmController.deposit(deposit)
                    console.log(`Your Balance Is $${resp.balance}`)
                    for (const row of resp.pay) {
                        console.log(`Transferred $${row.pay} to ${row.to}`)
                        console.log(`You owed $${row.debt} to ${row.to}`)
                    }
                }
                break

            case "withdraw":
                let withdraw = inputs.pop().replace("/./g","")
                    .replace("/,/g","")

                withdraw = parseInt(withdraw)
                if (isNaN(withdraw)) {
                    console.log("Please enter the right amount")
                } else {
                    const resp = await atmController.withdraw(withdraw)
                    console.log(`Your Balance Is $${resp.balance}`)
                    if (resp.debt) {
                        console.log(`You owed $${resp.debt} to ${resp.to}`)
                    }
                }
                break

            case "transfer":
                let transfer = inputs.pop().replace("/./g","")
                    .replace("/,/g","")
                const targetName = inputs.join(" ")

                transfer = parseInt(transfer)
                if (isNaN(transfer)) {
                    console.log("Please enter the right amount")
                } else {
                    const resp = await atmController.transfer(transfer, targetName)
                    if (resp.balance === undefined) {
                        console.log(resp)
                    } else {
                        console.log(`Transferred $${transfer} to ${targetName}`)
                        console.log(`Your Balance Is $${resp.balance}`)
                    }
                }
                break

            case "logout":
                console.log(`Goodbye, ${loggedAs}!`)
                loggedAs = ""
                break

            case "exit":
                console.log(`Closing ATM`)
                break

            default:
                console.log(`available commands:
- info
- deposit [amount]
- withdraw [amount]
- transfer [target] [amount]
- logout
- exit
`)
                break
        }
    }
    console.log()
}

