import PouchDB from 'pouchdb'

class AtmDB {

    constructor() {
        this.dbName = "atm"
        this.db = new PouchDB(this.dbName, {adapter: 'leveldb', prefix: 'db/'});
    }

    generateID(body) {
        let name = body.name.replace(" ", "-")
        return this.dbName.toLowerCase() + '_' + name
    }

    async get(id) {
        let result;
        try {
            result = await this.db.get(id)
        } catch (err) {
            return err;
        }
        return result
    }

    async getByName(name) {
        let result;
        try {
            result = await this.db.get(this.dbName.toLowerCase() + '_' + name)
        } catch (err) {
            return err;
        }
        return result
    }

    async create(body) {
        let doc_id = this.generateID(body)
        let result;
        try {
            result = await this.db.put({
                _id: doc_id,
                ...body
            })
        } catch (err) {
            return err;
        }
        return result
    }

    async deposit(amount, user) {
        let result;
        try {
            result = await this.db.put({
                ...user,
                balance: user.balance + amount
            })
        } catch (err) {
            return err;
        }
        return result
    }

    async withdraw(amount, user) {
        let result;
        try {
            if (amount > user.balance) {
                throw "not enough balance"
            }
            result = await this.db.put({
                ...user,
                balance: user.balance - amount
            })
        } catch (err) {
            return err.toString();
        }
        return result
    }

    async transfer(amount, user, targetUser) {
        let result;
        try {
            if (amount > user.balance) {
                throw "not enough balance"
            }
            result = await this.db.bulkDocs([
                {
                    ...user,
                    balance: user.balance - amount
                },
                {
                    ...targetUser,
                    balance: targetUser.balance + amount
                }
            ])
        } catch (err) {
            return err.toString();
        }
        return result
    }

    async update(body) {
        let result;
        try {
            result = await this.db.put(body)
        } catch (err) {
            return err;
        }
        return result
    }
}


class DebtDB {

    constructor() {
        this.dbName = "debt"
        this.db = new PouchDB(this.dbName, {adapter: 'leveldb', prefix: 'db/'});
    }

    generateID(body) {
        let lender = body.lender.replace(" ", "-")
        let borrower = body.borrower.replace(" ", "-")
        return this.dbName.toLowerCase() + '_' + borrower + '_' + lender
    }

    async get(id) {
        let result;
        try {
            result = await this.db.get(id)
        } catch (err) {
            return err;
        }
        return result
    }

    async getByLender(name) {
        let result;
        try {
            result = await this.db.allDocs({
                include_docs: true,
            });
            result = result.rows.filter((value) => value.doc.lender === name)
        } catch (err) {
            return err;
        }
        return result
    }

    async getByBorrower(name) {
        let result;
        try {
            result = await this.db.allDocs({
                include_docs: true,
                startkey: this.dbName.toLowerCase() + '_' + name,
                endkey: this.dbName.toLowerCase() + '_' + name + '\ufff0'
            });
        } catch (err) {
            return err;
        }
        return result
    }
x
    async getByLenderAndBorrower(borrower, lender) {
        let lenderVal = lender.replace(" ", "-")
        let borrowerVal = borrower.replace(" ", "-")
        let result;
        try {
            result = await this.db.get(this.dbName.toLowerCase() + '_' + borrowerVal + '_' + lenderVal)
        } catch (err) {
            return err;
        }
        return result
    }

    async create(body) {
        let doc_id = this.generateID(body)
        let result;
        try {
            result = await this.db.put({
                _id: doc_id,
                ...body
            })
        } catch (err) {
            return err;
        }
        return result
    }

    async update(body) {
        let result;
        try {
            result = await this.db.put(body)
        } catch (err) {
            return err;
        }
        return result
    }
}


export const atmDB = new AtmDB()
export const debtDB = new DebtDB()

export default {
    atmDB,
    debtDB
}