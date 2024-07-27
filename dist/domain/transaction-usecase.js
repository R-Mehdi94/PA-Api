"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionUsecase = void 0;
const transaction_1 = require("../database/entities/transaction");
class TransactionUsecase {
    constructor(db) {
        this.db = db;
    }
    listTransactions(listTransactionRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(transaction_1.Transaction, 'transaction');
            if (listTransactionRequest.type) {
                query.andWhere("transaction.type = :type", { type: listTransactionRequest.type });
            }
            if (listTransactionRequest.montant) {
                query.andWhere("transaction.montant = :montant", { montant: listTransactionRequest.montant });
            }
            if (listTransactionRequest.methodePaiement) {
                query.andWhere("transaction.methodePaiement = :methodePaiement", { methodePaiement: listTransactionRequest.methodePaiement });
            }
            if (listTransactionRequest.visiteur) {
                query.andWhere("transaction.visiteurId = :visiteur", { visiteur: listTransactionRequest.visiteur });
            }
            if (listTransactionRequest.adherent) {
                query.andWhere("transaction.adherentId = :adherent", { adherent: listTransactionRequest.adherent });
            }
            query.leftJoinAndSelect('transaction.visiteur', 'visiteur')
                .leftJoinAndSelect('transaction.adherent', 'adherent')
                .skip((listTransactionRequest.page - 1) * listTransactionRequest.limit)
                .take(listTransactionRequest.limit);
            const [Transactions, totalCount] = yield query.getManyAndCount();
            return {
                Transactions,
                totalCount
            };
        });
    }
    getOneTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(transaction_1.Transaction, 'transaction')
                .leftJoinAndSelect('transaction.visiteur', 'visiteur')
                .leftJoinAndSelect('transaction.adherent', 'adherent')
                .where("transaction.id = :id", { id: id });
            const transaction = yield query.getOne();
            if (!transaction) {
                console.log({ error: `Transaction ${id} not found` });
                return null;
            }
            return transaction;
        });
    }
    updateTransaction(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { type, montant, methodePaiement, visiteur, adherent }) {
            const repo = this.db.getRepository(transaction_1.Transaction);
            const transactionFound = yield repo.findOneBy({ id });
            if (transactionFound === null)
                return null;
            if (type === undefined && montant === undefined && methodePaiement === undefined && visiteur === undefined && adherent === undefined) {
                return "No changes";
            }
            if (type) {
                transactionFound.type = type;
            }
            if (montant !== undefined) {
                transactionFound.montant = montant;
            }
            if (methodePaiement) {
                transactionFound.methodePaiement = methodePaiement;
            }
            if (visiteur) {
                transactionFound.visiteur = visiteur;
            }
            if (adherent) {
                transactionFound.adherent = adherent;
            }
            const transactionUpdate = yield repo.save(transactionFound);
            return transactionUpdate;
        });
    }
}
exports.TransactionUsecase = TransactionUsecase;
