"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserValidation = exports.listUserValidation = exports.updateUserValidation = exports.userGetBlobValidation = exports.getIdToken = exports.userIdValidation = exports.createUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const user_1 = require("../../database/entities/user");
exports.createUserValidation = joi_1.default.object({
    nom: joi_1.default.string().required(),
    prenom: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    motDePasse: joi_1.default.string().required(),
    numTel: joi_1.default.string().min(10).max(10).required(),
    profession: joi_1.default.string().required(),
    role: joi_1.default.string().valid(...Object.values(user_1.UserRole)).required(),
    dateInscription: joi_1.default.date().required(),
    estBenevole: joi_1.default.boolean().required()
}).options({ abortEarly: false });
exports.userIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    token: joi_1.default.string().required(),
    idAdmin: joi_1.default.number().optional()
});
exports.getIdToken = joi_1.default.object({
    id: joi_1.default.number().required(),
    token: joi_1.default.string().required(),
    name: joi_1.default.string().required()
});
exports.userGetBlobValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    token: joi_1.default.string().required(),
    blobName: joi_1.default.string().required()
});
exports.updateUserValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    token: joi_1.default.string().required(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    numTel: joi_1.default.string().min(10).max(10).optional(),
    profession: joi_1.default.string().optional(),
    motDePasse: joi_1.default.string().optional(),
    role: joi_1.default.string().valid(...Object.values(user_1.UserRole)).optional(),
    estBenevole: joi_1.default.boolean().optional(),
    estEnLigne: joi_1.default.boolean().optional(),
    idAdmin: joi_1.default.number().optional()
});
exports.listUserValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    numTel: joi_1.default.string().min(10).max(10).optional(),
    profession: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    role: joi_1.default.string().valid(...Object.values(user_1.UserRole)).optional(),
    estBenevole: joi_1.default.boolean().optional(),
    estEnLigne: joi_1.default.boolean().optional()
});
exports.LoginUserValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    motDePasse: joi_1.default.string().required(),
}).options({ abortEarly: false });
