"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidationValidation = exports.verifAdherent = exports.adherentEmailValidation = exports.listAdherentValidation = exports.updateAdherentValidationUser = exports.updateAdherentValidation = exports.adherentIdValidationUser = exports.adherentIdValidation = exports.createAdherentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAdherentValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    motDePasse: joi_1.default.string().required(),
    nom: joi_1.default.string().required(),
    prenom: joi_1.default.string().required(),
    age: joi_1.default.number().required(),
    numTel: joi_1.default.string().required(),
    adresse: joi_1.default.string().required(),
    profession: joi_1.default.string().required(),
    estBanie: joi_1.default.boolean().required(),
    estBenevole: joi_1.default.boolean().required(),
    parrain: joi_1.default.number().required()
});
exports.adherentIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    token: joi_1.default.string().required()
});
exports.adherentIdValidationUser = joi_1.default.object({
    id: joi_1.default.number().required(),
    idAdmin: joi_1.default.number().optional()
});
exports.updateAdherentValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    email: joi_1.default.string().email().optional(),
    motDePasse: joi_1.default.string().optional(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    age: joi_1.default.number().optional(),
    numTel: joi_1.default.string().optional(),
    adresse: joi_1.default.string().optional(),
    profession: joi_1.default.string().optional(),
    estBanie: joi_1.default.boolean().optional(),
    estBenevole: joi_1.default.boolean().optional(),
    parrain: joi_1.default.number().optional(),
    token: joi_1.default.string().required()
});
exports.updateAdherentValidationUser = joi_1.default.object({
    id: joi_1.default.number().required(),
    email: joi_1.default.string().email().optional(),
    motDePasse: joi_1.default.string().optional(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    age: joi_1.default.number().optional(),
    numTel: joi_1.default.string().optional(),
    adresse: joi_1.default.string().optional(),
    profession: joi_1.default.string().optional(),
    estBanie: joi_1.default.boolean().optional(),
    estBenevole: joi_1.default.boolean().optional(),
    parrain: joi_1.default.number().optional()
});
exports.listAdherentValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    email: joi_1.default.string().email().optional(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    age: joi_1.default.number().optional(),
    numTel: joi_1.default.string().optional(),
    adresse: joi_1.default.string().optional(),
    profession: joi_1.default.string().optional(),
    estBanie: joi_1.default.boolean().optional(),
    estBenevole: joi_1.default.boolean().optional(),
    parrain: joi_1.default.number().optional()
});
exports.adherentEmailValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.verifAdherent = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    numTel: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.LoginValidationValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    motDePasse: joi_1.default.string().required(),
}).options({ abortEarly: false });
