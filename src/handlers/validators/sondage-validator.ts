import Joi from "joi";
import { TypeSondage } from "../../database/entities/sondage";

export const createSondageValidation = Joi.object<CreateSondageValidationRequest>({
    nom: Joi.string().max(255).required(),
    dateDebut: Joi.date().required(),
    dateFin: Joi.date().required(),
    description: Joi.string().required(),
    typeSondage: Joi.string().valid(...Object.values(TypeSondage)).required()
});

export interface CreateSondageValidationRequest {
    nom: string
    dateDebut: Date
    dateFin: Date
    description: string
    typeSondage: TypeSondage
}

export const sondageIdValidation = Joi.object<SondageIdRequest>({
    id: Joi.number().required(),
});

export interface SondageIdRequest {
    id: number
}

export const updateSondageValidation = Joi.object<UpdateSondageRequest>({
    id: Joi.number().required(),
    nom: Joi.string().max(255).optional(),
    dateDebut: Joi.date().optional(),
    dateFin: Joi.date().optional(),
    description: Joi.string().optional(),
    typeSondage: Joi.string().valid(...Object.values(TypeSondage)).optional()
});

export interface UpdateSondageRequest {
    id: number
    nom?: string
    dateDebut?: Date
    dateFin?: Date
    description?: string
    typeSondage?: TypeSondage
}

export const listSondageValidation = Joi.object<ListSondageRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    dateDebut: Joi.date().optional(),
    dateFin: Joi.date().optional(),
    typeSondage: Joi.string().valid(...Object.values(TypeSondage)).optional()
});

export interface ListSondageRequest {
    page: number
    limit: number
    nom?: string
    dateDebut?: Date
    dateFin?: Date
    typeSondage?: TypeSondage
}
