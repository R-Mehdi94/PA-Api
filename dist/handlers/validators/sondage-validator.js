"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSondageValidation = exports.updateSondageValidation = exports.sondageIdValidation = exports.createSondageValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const sondage_1 = require("../../database/entities/sondage");
exports.createSondageValidation = joi_1.default.object({
    nom: joi_1.default.string().max(255).required(),
    dateDebut: joi_1.default.date().required(),
    dateFin: joi_1.default.date().required(),
    description: joi_1.default.string().required(),
    typeSondage: joi_1.default.string().valid(...Object.values(sondage_1.TypeSondage)).required()
});
exports.sondageIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateSondageValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    nom: joi_1.default.string().max(255).optional(),
    dateDebut: joi_1.default.date().optional(),
    dateFin: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    typeSondage: joi_1.default.string().valid(...Object.values(sondage_1.TypeSondage)).optional()
});
exports.listSondageValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    nom: joi_1.default.string().optional(),
    dateDebut: joi_1.default.date().optional(),
    dateFin: joi_1.default.date().optional(),
    typeSondage: joi_1.default.string().valid(...Object.values(sondage_1.TypeSondage)).optional()
});
