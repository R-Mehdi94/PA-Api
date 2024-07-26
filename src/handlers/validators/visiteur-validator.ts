import Joi from "joi";

export const createVisiteurValidation = Joi.object<CreateVisiteurValidationRequest>({
    email: Joi.string().email().required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    age: Joi.number().required(),
    numTel: Joi.string().required(),
    profession: Joi.string().required()
});

export interface CreateVisiteurValidationRequest {
    email: string
    nom: string
    prenom: string
    age: number
    numTel: string
    profession: string
}

export const visiteurIdValidation = Joi.object<VisiteurIdRequest>({
    id: Joi.number().required(),
});

export interface VisiteurIdRequest {
    id: number
}

export const updateVisiteurValidation = Joi.object<UpdateVisiteurRequest>({
    id: Joi.number().required(),
    email: Joi.string().email().optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    age: Joi.number().optional(),
    numTel: Joi.string().optional(),
    profession: Joi.string().optional()
});

export interface UpdateVisiteurRequest {
    id: number
    email?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    profession?: string
}

export const listVisiteurValidation = Joi.object<ListVisiteurRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    email: Joi.string().email().optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    age: Joi.number().optional(),
    numTel: Joi.string().optional(),
    profession: Joi.string().optional()
});

export interface ListVisiteurRequest {
    page: number
    limit: number
    email?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    profession?: string
}
