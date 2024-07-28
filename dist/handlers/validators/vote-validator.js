"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listVoteValidation = exports.updateVoteValidation = exports.voteIdValidation = exports.createVoteValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createVoteValidation = joi_1.default.object({
    choix: joi_1.default.string().max(255).required(),
    numTour: joi_1.default.number().required(),
    proposition: joi_1.default.number().required(),
    user: joi_1.default.number().required()
});
exports.voteIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateVoteValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    choix: joi_1.default.string().max(255).optional(),
    numTour: joi_1.default.number().optional(),
    proposition: joi_1.default.number().optional(),
    user: joi_1.default.number().optional()
});
exports.listVoteValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    choix: joi_1.default.string().optional(),
    numTour: joi_1.default.number().optional(),
    proposition: joi_1.default.number().optional(),
    user: joi_1.default.number().optional()
});
