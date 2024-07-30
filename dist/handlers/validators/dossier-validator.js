"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDossierValidation = exports.updateDossierValidation = exports.dossierUserIdValidation = exports.dossierIdValidation = exports.createDossierValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createDossierValidation = joi_1.default.object({
    nom: joi_1.default.string().required(),
    nomUtilisateur: joi_1.default.string().required(),
    type: joi_1.default.string().required(),
    token: joi_1.default.number().optional(),
    dossier: joi_1.default.number().optional(),
    user: joi_1.default.number().required()
});
exports.dossierIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.dossierUserIdValidation = joi_1.default.object({
    dossierId: joi_1.default.number().required(),
    id: joi_1.default.number().required(),
    token: joi_1.default.string().required()
});
exports.updateDossierValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    nom: joi_1.default.string().optional(),
    nomUtilisateur: joi_1.default.string().optional(),
    type: joi_1.default.string().optional(),
    token: joi_1.default.number().optional(),
    dossier: joi_1.default.number().allow(null).allow(undefined).optional(),
    user: joi_1.default.number().optional()
});
exports.listDossierValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    nom: joi_1.default.string().optional(),
    nomUtilisateur: joi_1.default.string().optional(),
    type: joi_1.default.string().optional(),
    token: joi_1.default.number().optional(),
    dossier: joi_1.default.number().optional(),
    user: joi_1.default.number().optional()
});
