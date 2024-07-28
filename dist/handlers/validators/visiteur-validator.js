"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listVisiteurValidation = exports.updateVisiteurValidation = exports.verifVisiteur = exports.visiteurIdValidation = exports.createVisiteurValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createVisiteurValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    nom: joi_1.default.string().required(),
    prenom: joi_1.default.string().required(),
    age: joi_1.default.number().required(),
    numTel: joi_1.default.string().required(),
    profession: joi_1.default.string().required(),
    estBanie: joi_1.default.boolean().required()
});
exports.visiteurIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.verifVisiteur = joi_1.default.object({
    email: joi_1.default.string().email().required(),
}).options({ abortEarly: false });
exports.updateVisiteurValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    email: joi_1.default.string().email().optional(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    age: joi_1.default.number().optional(),
    numTel: joi_1.default.string().optional(),
    profession: joi_1.default.string().optional(),
    estBanie: joi_1.default.boolean().optional()
});
exports.listVisiteurValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    email: joi_1.default.string().email().optional(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    age: joi_1.default.number().optional(),
    numTel: joi_1.default.string().optional(),
    profession: joi_1.default.string().optional(),
    estBanie: joi_1.default.boolean().optional()
});
