import Joi from "joi";
import { Evenement } from "../../database/entities/evenement";
import { Visiteur } from "../../database/entities/visiteur";
import { Adherent } from "../../database/entities/adherent";

export const createInscriptionValidation = Joi.object<CreateInscriptionValidationRequest>({
    evenement: Joi.number().required(),
    visiteur: Joi.number().required(),
    adherent: Joi.number().required()
});

export interface CreateInscriptionValidationRequest {
    evenement: Evenement
    visiteur: Visiteur
    adherent: Adherent
}

export const deleteInscriptionValidationRequest = Joi.object<DeleteInscriptionValidationRequest>({
    emailVisiteur: Joi.string().email().required(),
    evenement: Joi.number().required()
}).options({ abortEarly: false })

export interface DeleteInscriptionValidationRequest {
    emailVisiteur: string
    evenement: number
}
export const inscriptionIdValidation = Joi.object<InscriptionIdRequest>({
    id: Joi.number().required(),
});

export interface InscriptionIdRequest {
    id: number
}

export const updateInscriptionValidation = Joi.object<UpdateInscriptionRequest>({
    id: Joi.number().required(),
    evenement: Joi.number().optional(),
    visiteur: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface UpdateInscriptionRequest {
    id: number
    evenement?: Evenement
    visiteur?: Visiteur
    adherent?: Adherent
}


export const verifEmail = Joi.object<VerifEmail>({
    emailVisiteur: Joi.string().email().required(),
    evenement: Joi.number().required()
}).options({ abortEarly: false })

export interface VerifEmail {
    emailVisiteur: string
    evenement: number
}


export const listInscriptionValidation = Joi.object<ListInscriptionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    evenement: Joi.number().optional(),
    visiteur: Joi.number().optional(),
    adherent: Joi.number().optional()
});

export interface ListInscriptionRequest {
    page: number
    limit: number
    evenement?: number
    visiteur?: number
    adherent?: number
}
