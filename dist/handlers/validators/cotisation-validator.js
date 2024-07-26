"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCotisationValidation = exports.updateCotisationValidation = exports.cotisationIdValidation = exports.createCotisationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const cotisation_1 = require("../../database/entities/cotisation");
exports.createCotisationValidation = joi_1.default.object({
    type: joi_1.default.string().valid(...Object.values(cotisation_1.typeCotisation)).required(),
    Ajours: joi_1.default.boolean().required(),
    user: joi_1.default.number().required(),
    adherent: joi_1.default.number().required()
});
exports.cotisationIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateCotisationValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    type: joi_1.default.string().valid(...Object.values(cotisation_1.typeCotisation)).optional(),
    Ajours: joi_1.default.boolean().optional(),
    user: joi_1.default.number().optional(),
    adherent: joi_1.default.number().optional()
});
exports.listCotisationValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    type: joi_1.default.string().valid(...Object.values(cotisation_1.typeCotisation)).optional(),
    Ajours: joi_1.default.boolean().optional(),
    user: joi_1.default.number().optional(),
    adherent: joi_1.default.number().optional()
});
