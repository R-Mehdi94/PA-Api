import { DataSource } from "typeorm";
import { Transaction, TypeTransaction } from "../database/entities/transaction";
import { Adherent } from "../database/entities/adherent";
import { Visiteur } from "../database/entities/visiteur";

export interface ListTransactionRequest {
    page: number
    limit: number
    type?: TypeTransaction
    montant?: number
    methodePaiement?: string
    visiteur?: number
    adherent?: number
}

export interface UpdateTransactionParams {
    type?: TypeTransaction
    montant?: number
    methodePaiement?: string
    visiteur?: Visiteur
    adherent?: Adherent
}

export class TransactionUsecase {
    constructor(private readonly db: DataSource) { }

    async listTransactions(listTransactionRequest: ListTransactionRequest): Promise<{ Transactions: Transaction[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Transaction, 'transaction');
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

        const [Transactions, totalCount] = await query.getManyAndCount();
        return {
            Transactions,
            totalCount
        };
    }

    async getOneTransaction(id: number): Promise<Transaction | null> {
        const query = this.db.createQueryBuilder(Transaction, 'transaction')
            .leftJoinAndSelect('transaction.visiteur', 'visiteur')
            .leftJoinAndSelect('transaction.adherent', 'adherent')
            .where("transaction.id = :id", { id: id });

        const transaction = await query.getOne();

        if (!transaction) {
            console.log({ error: `Transaction ${id} not found` });
            return null;
        }
        return transaction;
    }

    async updateTransaction(id: number, { type, montant, methodePaiement, visiteur, adherent }: UpdateTransactionParams): Promise<Transaction | string | null> {
        const repo = this.db.getRepository(Transaction);
        const transactionFound = await repo.findOneBy({ id });
        if (transactionFound === null) return null;

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

        const transactionUpdate = await repo.save(transactionFound);
        return transactionUpdate;
    }
}
