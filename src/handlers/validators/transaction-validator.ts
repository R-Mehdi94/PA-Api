import Joi from "joi";
import { TypeTransaction } from "../../database/entities/transaction";
import { Visiteur } from "../../database/entities/visiteur";
import { Adherent } from "../../database/entities/adherent";

export const createTransactionValidation = Joi.object<CreateTransactionValidationRequest>({
    montant: Joi.number().required(),
    methodePaiement: Joi.string().required(),
    type: Joi.string().valid(...Object.values(TypeTransaction)).required(),
    visiteur: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface CreateTransactionValidationRequest {
    montant: number
    methodePaiement: string
    type: TypeTransaction
    visiteur?: Visiteur
    adherent?: Adherent
}

export const transactionIdValidation = Joi.object<TransactionIdRequest>({
    id: Joi.number().required(),
});

export interface TransactionIdRequest {
    id: number
}

export const updateTransactionValidation = Joi.object<UpdateTransactionRequest>({
    id: Joi.number().required(),
    montant: Joi.number().optional(),
    methodePaiement: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(TypeTransaction)).optional(),
    visiteur: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface UpdateTransactionRequest {
    id: number
    montant?: number
    methodePaiement?: string
    type?: TypeTransaction
    visiteur?: Visiteur
    adherent?: Adherent
}

export const listTransactionValidation = Joi.object<ListTransactionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    montant: Joi.number().optional(),
    methodePaiement: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(TypeTransaction)).optional(),
    visiteur: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface ListTransactionRequest {
    page: number
    limit: number
    montant?: number
    methodePaiement?: string
    type?: TypeTransaction
    visiteur?: number
    adherent?: number
}
