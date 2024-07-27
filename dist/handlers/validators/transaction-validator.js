"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTransactionValidation = exports.updateTransactionValidation = exports.transactionIdValidation = exports.createTransactionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const transaction_1 = require("../../database/entities/transaction");
exports.createTransactionValidation = joi_1.default.object({
    montant: joi_1.default.number().required(),
    methodePaiement: joi_1.default.string().required(),
    type: joi_1.default.string().valid(...Object.values(transaction_1.TypeTransaction)).required(),
    visiteur: joi_1.default.number().required(),
    adherent: joi_1.default.number().required()
});
exports.transactionIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateTransactionValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    montant: joi_1.default.number().optional(),
    methodePaiement: joi_1.default.string().optional(),
    type: joi_1.default.string().valid(...Object.values(transaction_1.TypeTransaction)).optional(),
    visiteur: joi_1.default.number().optional(),
    adherent: joi_1.default.number().optional()
});
exports.listTransactionValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    montant: joi_1.default.number().optional(),
    methodePaiement: joi_1.default.string().optional(),
    type: joi_1.default.string().valid(...Object.values(transaction_1.TypeTransaction)).optional(),
    visiteur: joi_1.default.number().optional(),
    adherent: joi_1.default.number().optional()
});
