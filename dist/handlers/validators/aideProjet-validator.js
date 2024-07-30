"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAideProjetValidation = exports.updateAideProjetValidation = exports.aideProjetIdValidation = exports.createAideProjetValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAideProjetValidation = joi_1.default.object({
    titre: joi_1.default.string().required(),
    descriptionProjet: joi_1.default.string().required(),
    budget: joi_1.default.number().required(),
    deadline: joi_1.default.date().required(),
    visiteur: joi_1.default.number().optional(),
    adherent: joi_1.default.number().optional()
});
exports.aideProjetIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateAideProjetValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    titre: joi_1.default.string().optional(),
    descriptionProjet: joi_1.default.string().optional(),
    budget: joi_1.default.number().optional(),
    deadline: joi_1.default.date().optional(),
    visiteur: joi_1.default.number().optional(),
    adherent: joi_1.default.number().optional()
});
exports.listAideProjetValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    titre: joi_1.default.string().optional(),
    descriptionProjet: joi_1.default.string().optional(),
    budget: joi_1.default.number().optional(),
    deadline: joi_1.default.date().optional(),
    visiteur: joi_1.default.number().optional(),
    adherent: joi_1.default.number().optional()
});
