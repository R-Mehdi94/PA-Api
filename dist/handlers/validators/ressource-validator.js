"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRessourceValidation = exports.updateRessourceValidation = exports.ressourceIdValidation = exports.createRessourceValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const ressource_1 = require("../../database/entities/ressource");
exports.createRessourceValidation = joi_1.default.object({
    nom: joi_1.default.string().required(),
    type: joi_1.default.string().valid(...Object.values(ressource_1.TypeRessource)).required(),
    quantite: joi_1.default.number().required(),
    sync_status: joi_1.default.string().required(),
    emplacement: joi_1.default.string().required()
});
exports.ressourceIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateRessourceValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    nom: joi_1.default.string().optional(),
    type: joi_1.default.string().valid(...Object.values(ressource_1.TypeRessource)).optional(),
    quantite: joi_1.default.number().optional(),
    sync_status: joi_1.default.string().optional(),
    emplacement: joi_1.default.string().optional()
});
exports.listRessourceValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    nom: joi_1.default.string().optional(),
    type: joi_1.default.string().valid(...Object.values(ressource_1.TypeRessource)).optional(),
    quantite: joi_1.default.number().optional(),
    sync_status: joi_1.default.string().optional(),
    emplacement: joi_1.default.string().optional()
});
