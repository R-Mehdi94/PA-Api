import Joi from "joi";
import { Visiteur } from "../../database/entities/visiteur";
import { Adherent } from "../../database/entities/adherent";

export const createAideProjetValidation = Joi.object<CreateAideProjetValidationRequest>({
    titre: Joi.string().required(),
    descriptionProjet: Joi.string().required(),
    budget: Joi.number().required(),
    deadline: Joi.date().required(),
    visiteur: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface CreateAideProjetValidationRequest {
    titre: string
    descriptionProjet: string
    budget: number
    deadline: Date
    visiteur?: Visiteur
    adherent?: Adherent
}

export const aideProjetIdValidation = Joi.object<AideProjetIdRequest>({
    id: Joi.number().required(),
});

export interface AideProjetIdRequest {
    id: number
}

export const updateAideProjetValidation = Joi.object<UpdateAideProjetRequest>({
    id: Joi.number().required(),
    titre: Joi.string().optional(),
    descriptionProjet: Joi.string().optional(),
    budget: Joi.number().optional(),
    deadline: Joi.date().optional(),
    visiteur: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface UpdateAideProjetRequest {
    id: number
    titre?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
    visiteur?: Visiteur
    adherent?: Adherent
}

export const listAideProjetValidation = Joi.object<ListAideProjetRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    titre: Joi.string().optional(),
    descriptionProjet: Joi.string().optional(),
    budget: Joi.number().optional(),
    deadline: Joi.date().optional(),
    visiteur: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface ListAideProjetRequest {
    page: number
    limit: number
    titre?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
    visiteur?: number
    adherent?: number
}
