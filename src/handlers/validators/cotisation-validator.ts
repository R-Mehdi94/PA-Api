import Joi from "joi";
import { typeCotisation } from "../../database/entities/cotisation";
import { Adherent } from "../../database/entities/adherent";
import { User } from "../../database/entities/user";

export const createCotisationValidation = Joi.object<CreateCotisationValidationRequest>({
    type: Joi.string().valid(...Object.values(typeCotisation)).required(),
    Ajours: Joi.boolean().required(),
    user: Joi.number().required(),
    adherent: Joi.number().required()
});

export interface CreateCotisationValidationRequest {
    type: typeCotisation
    Ajours: boolean
    user: User
    adherent: Adherent
}

export const cotisationIdValidation = Joi.object<CotisationIdRequest>({
    id: Joi.number().required(),
});

export interface CotisationIdRequest {
    id: number
}

export const updateCotisationValidation = Joi.object<UpdateCotisationRequest>({
    id: Joi.number().required(),
    type: Joi.string().valid(...Object.values(typeCotisation)).optional(),
    Ajours: Joi.boolean().optional(),
    user: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface UpdateCotisationRequest {
    id: number
    type?: typeCotisation
    Ajours?: boolean
    user?: User
    adherent?: Adherent
}

export const listCotisationValidation = Joi.object<ListCotisationRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    type: Joi.string().valid(...Object.values(typeCotisation)).optional(),
    Ajours: Joi.boolean().optional(),
    user: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface ListCotisationRequest {
    page: number
    limit: number
    type?: typeCotisation
    Ajours?: boolean
    user?: number
    adherent?: number
}
