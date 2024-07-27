"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDemandeValidation = exports.updateDemandeValidation = exports.demandeIdValidation = exports.createDemandeValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const demande_1 = require("../../database/entities/demande");
exports.createDemandeValidation = joi_1.default.object({
    type: joi_1.default.string().valid(...Object.values(demande_1.TypeDemande)).required(),
    dateDemande: joi_1.default.date().required(),
    statut: joi_1.default.string().valid(...Object.values(demande_1.StatutDemande)).required(),
    emailVisiteur: joi_1.default.string().email().required(),
    adherent: joi_1.default.number().optional(),
    visiteur: joi_1.default.number().optional()
});
exports.demandeIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateDemandeValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    type: joi_1.default.string().valid(...Object.values(demande_1.TypeDemande)).optional(),
    dateDemande: joi_1.default.date().optional(),
    statut: joi_1.default.string().valid(...Object.values(demande_1.StatutDemande)).optional(),
    emailVisiteur: joi_1.default.string().email().optional(),
    adherent: joi_1.default.number().optional(),
    visiteur: joi_1.default.number().optional()
});
exports.listDemandeValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    type: joi_1.default.string().valid(...Object.values(demande_1.TypeDemande)).optional(),
    dateDemande: joi_1.default.date().optional(),
    statut: joi_1.default.string().valid(...Object.values(demande_1.StatutDemande)).optional(),
    emailVisiteur: joi_1.default.string().email().optional(),
    adherent: joi_1.default.number().optional(),
    visiteur: joi_1.default.number().optional()
});
