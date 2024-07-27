import Joi from "joi";
import { TypeDemande, StatutDemande } from "../../database/entities/demande";
import { Adherent } from "../../database/entities/adherent";
import { Visiteur } from "../../database/entities/visiteur";

export const createDemandeValidation = Joi.object<CreateDemandeValidationRequest>({
    type: Joi.string().valid(...Object.values(TypeDemande)).required(),
    dateDemande: Joi.date().required(),
    statut: Joi.string().valid(...Object.values(StatutDemande)).required(),
    adherent: Joi.number().optional(),
    visiteur: Joi.number().optional()
});

export interface CreateDemandeValidationRequest {
    type: TypeDemande
    dateDemande: Date
    statut: StatutDemande
    adherent?: Adherent
    visiteur?: Visiteur
}

export const demandeIdValidation = Joi.object<DemandeIdRequest>({
    id: Joi.number().required(),
});

export interface DemandeIdRequest {
    id: number
}

export const updateDemandeValidation = Joi.object<UpdateDemandeRequest>({
    id: Joi.number().required(),
    type: Joi.string().valid(...Object.values(TypeDemande)).optional(),
    dateDemande: Joi.date().optional(),
    statut: Joi.string().valid(...Object.values(StatutDemande)).optional(),
    adherent: Joi.number().optional(),
    visiteur: Joi.number().optional()
});

export interface UpdateDemandeRequest {
    id: number
    type?: TypeDemande
    dateDemande?: Date
    statut?: StatutDemande
    adherent?: Adherent
    visiteur?: Visiteur
}

export const listDemandeValidation = Joi.object<ListDemandeRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    type: Joi.string().valid(...Object.values(TypeDemande)).optional(),
    dateDemande: Joi.date().optional(),
    statut: Joi.string().valid(...Object.values(StatutDemande)).optional(),
    adherent: Joi.number().optional(),
    visiteur: Joi.number().optional()
});

export interface ListDemandeRequest {
    page: number
    limit: number
    type?: TypeDemande
    dateDemande?: Date
    statut?: StatutDemande
    adherent?: number
    visiteur?: number
}
