import {atmController} from "../src/controller/atm.js";
import {atmDB} from "../src/store/atm.js";

import * as assert from "assert";

describe('atm', function () {
    const randomName = "test-" + (Math.random() + 1).toString(36).substring(7);
    console.log("random", randomName);

    describe('create user 1', function () {
        it('create account 1', async function () {
            const resp = await atmController.login(randomName + "1")
            assert.equal(resp.name, randomName + "1");
            assert.equal(resp.balance, 0);
        });
    });

    describe('create user 2', function () {
        it('create account 2 and use it', async function () {
            const resp = await atmController.login(randomName + "2")
            assert.equal(resp.name, randomName + "2");
            assert.equal(resp.balance, 0);
        });
    });

    describe('deposit', function () {
        it('should have $100', async function () {
            const resp = await atmController.deposit(100)
            assert.equal(resp.balance, 100);
        });
    });

    describe('withdraw', function () {
        it('should have $50', async function () {
            const resp = await atmController.withdraw(50)
            assert.equal(resp.balance, 50);
        });
    });

    describe('transfer', function () {
        it('user 2 should have $20', async function () {
            const resp = await atmController.transfer(30,randomName + "1")
            assert.equal(resp.balance, 20);
        });

        it('user 1 should have $30', async function () {
            const resp = await atmController.login(randomName + "1")
            assert.equal(resp.name, randomName + "1");
            assert.equal(resp.balance, 30);
        });

        it('user 2 should have $0 and owed user 1 $10', async function () {
            const login2 = await atmController.login(randomName + "2")
            assert.equal(login2.name, randomName + "2");
            const trans = await atmController.transfer(30,randomName + "1")
            assert.equal(trans.balance, 0);
            assert.equal(trans.debt, 10);
            assert.equal(trans.to, randomName + "1");
        });

        it('user 1 should have $50 and owed $10 from user 2', async function () {
            const login1 = await atmController.login(randomName + "1")
            assert.equal(login1.name, randomName + "1");
            assert.equal(login1.balance, 50);
            assert.equal(login1.receivables[0].doc.borrower, randomName + "2");
            assert.equal(login1.receivables[0].doc.amount, 10);
        });

        it('user 2 should have $10 and transferred $10 to user 1', async function () {
            const login2 = await atmController.login(randomName + "2")
            assert.equal(login2.name, randomName + "2");
            assert.equal(login2.balance, 0);
            assert.equal(login2.debts.rows[0].doc.amount, 10);
            assert.equal(login2.debts.rows[0].doc.lender, randomName + "1");
            const depo = await atmController.deposit(20)
            assert.equal(depo.balance, 10);
            assert.equal(depo.pay[0].pay, 10);
            assert.equal(depo.pay[0].debt, 0);
            assert.equal(depo.pay[0].to, randomName + "1");
        });

        it('user 1 should have $60', async function () {
            const login1 = await atmController.login(randomName + "1")
            assert.equal(login1.name, randomName + "1");
            assert.equal(login1.balance, 60);
        });
    });

    describe('remove', function () {
        it('remove test account', async function () {
            const acc1 = await atmDB.getByName(randomName + "1")
            await atmDB.update({...acc1, _deleted: true})

            const acc2 = await atmDB.getByName(randomName + "2")
            await atmDB.update({...acc2, _deleted: true})
        });
    });
});