import { atmDB, debtDB } from "../store/atm.js";


class AtmController {

    constructor() {
        this.currentUser = ""
        this.currentDebts = []
        this.currentReceivables = []
    }

    async login(name) {
        let result = await atmDB.getByName(name)
        if (result.status === 404) {
            const body = {
                "name": name,
                "balance": 0
            }
            const resp = await atmDB.create(body)
            if (!resp.ok) {
                throw resp
            }
        }

        await this.setCurrentUser(name)
        await this.setCurrentDebts()
        await this.setCurrentReceivables()
        return this.getInfo()
    }

    getInfo() {
        return {
            ...this.currentUser,
            debts: this.currentDebts,
            receivables: this.currentReceivables
        }
    }

    async setCurrentUser(name) {
        this.currentUser = await atmDB.getByName(name)
    }

    async refreshCurrentUser() {
        this.currentUser = await atmDB.get(this.currentUser._id)
    }

    async deposit(amount) {
        let remain = amount
        let transferred = []
        for (const debt of this.currentDebts.rows) {
            if (remain === 0) {
                break
            }
            let payAmount = 0
            if (debt.doc.amount <= remain) {
                remain = remain - debt.doc.amount
                payAmount = debt.doc.amount
            } else {
                payAmount = remain
                remain = 0
            }
            transferred.push(await this.debtPayment(payAmount, debt.doc))
        }
        if (remain) {
            await atmDB.deposit(amount, this.currentUser)
        }
        await this.refreshCurrentUser()
        return {
            ...this.currentUser,
            pay: transferred
        }
    }

    async withdraw(amount) {
        let amountUser = amount
        let debt = {}
        if (amount > this.currentUser.balance) {
            amountUser =  this.currentUser.balance
            const amountDebt = amount - this.currentUser.balance
            debt = await this.debtSubmission(amountDebt)
        }
        await atmDB.withdraw(amountUser, this.currentUser)
        await this.refreshCurrentUser()
        return {
            ...this.currentUser,
            ...debt
        }
    }

    async transfer(amount, targetName) {
        const targetUser = await atmDB.getByName(targetName)
        if (targetUser.status === 404) {
            return "Target User Not Found"
        }

        let amountUser = amount
        let debt = {}
        if (amount > this.currentUser.balance) {
            amountUser =  this.currentUser.balance
            const amountDebt = amount - this.currentUser.balance
            debt = await this.debtSubmission(amountDebt, targetName)
        }

        await atmDB.transfer(amountUser, this.currentUser, targetUser)
        await this.refreshCurrentUser()
        return {
            ...this.currentUser,
            ...debt
        }
    }

    async setCurrentDebts() {
        this.currentDebts = await debtDB.getByBorrower(this.currentUser.name)
    }

    async setCurrentReceivables() {
        this.currentReceivables = await debtDB.getByLender(this.currentUser.name)
    }

    async debtPayment(amount, debt) {
        const totalAmount = debt.amount - amount
        if (totalAmount === 0) {
            debt._deleted = true
        } else {
            debt.amount = totalAmount
        }
        await debtDB.update(debt)
        await this.setCurrentDebts()
        await this.setCurrentReceivables()
        return {
            debt: totalAmount,
            pay: amount,
            to: debt.lender
        }
    }

    async debtSubmission(amount, targetName="Bank Katalis") {
        if (targetName !== "Bank Katalis") {
            const targetUserExists = await atmDB.getByName(targetName)
            if (targetUserExists.status === 404) {
                throw  "target user not found"
            }
        }

        const exists = await debtDB.getByLenderAndBorrower(this.currentUser.name, targetName)
        let totalAmount = amount
        if (exists.status === 404) {
            const body = {
                "lender": targetName,
                "borrower": this.currentUser.name,
                "amount": totalAmount
            }
            await debtDB.create(body)
        } else {
            totalAmount = exists.amount + amount
            const body = {
                ...exists,
                "amount": exists.amount + amount
            }
            await debtDB.update(body)
        }
        await this.setCurrentDebts()
        await this.setCurrentReceivables()
        return {
            debt: totalAmount,
            to: targetName
        }
    }
}


export const atmController = new AtmController()

export default {
    atmController
}
