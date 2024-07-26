import Joi from "joi";
import { StatutTache } from "../../database/entities/tache";
import { User } from "../../database/entities/user";
import { Ressource } from "../../database/entities/ressource";

export const createTacheValidation = Joi.object<CreateTacheValidationRequest>({
    description: Joi.string().required(),
    dateDebut: Joi.date().required(),
    dateFin: Joi.date().required(),
    statut: Joi.string().valid(...Object.values(StatutTache)).required(),
    responsable: Joi.number().required(),
    ressource: Joi.number().required()
});

export interface CreateTacheValidationRequest {
    description: string
    dateDebut: Date
    dateFin: Date
    statut: StatutTache
    responsable: User
    ressource: Ressource
}

export const tacheIdValidation = Joi.object<TacheIdRequest>({
    id: Joi.number().required(),
});

export interface TacheIdRequest {
    id: number
}

export const updateTacheValidation = Joi.object<UpdateTacheRequest>({
    id: Joi.number().required(),
    description: Joi.string().optional(),
    dateDebut: Joi.date().optional(),
    dateFin: Joi.date().optional(),
    statut: Joi.string().valid(...Object.values(StatutTache)).optional(),
    responsable: Joi.number().optional(),
    ressource: Joi.number().optional()
});

export interface UpdateTacheRequest {
    id: number
    description?: string
    dateDebut?: Date
    dateFin?: Date
    statut?: StatutTache
    responsable?: User
    ressource?: Ressource
}

export const listTacheValidation = Joi.object<ListTacheRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    description: Joi.string().optional(),
    dateDebut: Joi.date().optional(),
    dateFin: Joi.date().optional(),
    statut: Joi.string().valid(...Object.values(StatutTache)).optional(),
    responsable: Joi.number().optional(),
    ressource: Joi.number().optional()
});

export interface ListTacheRequest {
    page: number
    limit: number
    description?: string
    dateDebut?: Date
    dateFin?: Date
    statut?: StatutTache
    responsable?: number
    ressource?: number
}
