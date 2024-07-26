"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTacheValidation = exports.updateTacheValidation = exports.tacheIdValidation = exports.createTacheValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const tache_1 = require("../../database/entities/tache");
exports.createTacheValidation = joi_1.default.object({
    description: joi_1.default.string().required(),
    dateDebut: joi_1.default.date().required(),
    dateFin: joi_1.default.date().required(),
    statut: joi_1.default.string().valid(...Object.values(tache_1.StatutTache)).required(),
    responsable: joi_1.default.number().required(),
    ressource: joi_1.default.number().required()
});
exports.tacheIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateTacheValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    description: joi_1.default.string().optional(),
    dateDebut: joi_1.default.date().optional(),
    dateFin: joi_1.default.date().optional(),
    statut: joi_1.default.string().valid(...Object.values(tache_1.StatutTache)).optional(),
    responsable: joi_1.default.number().optional(),
    ressource: joi_1.default.number().optional()
});
exports.listTacheValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    description: joi_1.default.string().optional(),
    dateDebut: joi_1.default.date().optional(),
    dateFin: joi_1.default.date().optional(),
    statut: joi_1.default.string().valid(...Object.values(tache_1.StatutTache)).optional(),
    responsable: joi_1.default.number().optional(),
    ressource: joi_1.default.number().optional()
});
