import Joi from "joi";
import { User } from "../../database/entities/user";

export const createAdherentValidation = Joi.object<CreateAdherentValidationRequest>({
    email: Joi.string().email().required(),
    motDePasse: Joi.string().required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    age: Joi.number().required(),
    numTel: Joi.string().required(),
    adresse: Joi.string().required(),
    profession: Joi.string().required(),
    estBanie: Joi.boolean().required(),
    estBenevole: Joi.boolean().required(),
    parrain: Joi.number().required()
});

export interface CreateAdherentValidationRequest {
    email: string
    motDePasse: string
    nom: string
    prenom: string
    age: number
    numTel: string
    adresse: string
    profession: string
    estBanie: boolean
    estBenevole: boolean
    parrain: User
}

export const adherentIdValidation = Joi.object<AdherentIdRequest>({
    id: Joi.number().required(),
    token: Joi.string().required()

});

export interface AdherentIdRequest {
    id: number
    token:string
}

export const adherentIdValidationUser = Joi.object<AdherentIdRequestUser>({
    id: Joi.number().required(),
    idAdmin: Joi.number().optional()
});

export interface AdherentIdRequestUser {
    id: number
    idAdmin?: number
}

export const updateAdherentValidation = Joi.object<UpdateAdherentRequest>({
    id: Joi.number().required(),
    email: Joi.string().email().optional(),
    motDePasse: Joi.string().optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    age: Joi.number().optional(),
    numTel: Joi.string().optional(),
    adresse: Joi.string().optional(),
    profession: Joi.string().optional(),
    estBanie: Joi.boolean().optional(),
    estBenevole: Joi.boolean().optional(),
    parrain: Joi.number().optional(),
    token: Joi.string().required()
});

export interface UpdateAdherentRequest {
    id: number
    email?: string
    motDePasse?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    estBanie?: boolean
    estBenevole?: boolean
    parrain?: User
    token: string
}

export const updateAdherentValidationUser = Joi.object<UpdateAdherentRequestUser>({
    id: Joi.number().required(),
    email: Joi.string().email().optional(),
    motDePasse: Joi.string().optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    age: Joi.number().optional(),
    numTel: Joi.string().optional(),
    adresse: Joi.string().optional(),
    profession: Joi.string().optional(),
    estBanie: Joi.boolean().optional(),
    estBenevole: Joi.boolean().optional(),
    parrain: Joi.number().optional()
});

export interface UpdateAdherentRequestUser {
    id: number
    email?: string
    motDePasse?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    estBanie?: boolean
    estBenevole?: boolean
    parrain?: User
}

export const listAdherentValidation = Joi.object<ListAdherentRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    email: Joi.string().email().optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    age: Joi.number().optional(),
    numTel: Joi.string().optional(),
    adresse: Joi.string().optional(),
    profession: Joi.string().optional(),
    estBanie: Joi.boolean().optional(),
    estBenevole: Joi.boolean().optional(),
    parrain: Joi.number().optional()
});

export interface ListAdherentRequest {
    page: number
    limit: number
    email?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    estBanie?: boolean
    estBenevole?: boolean
    parrain?: number
}

export const adherentEmailValidation = Joi.object<AdherentEmailRequest>({
    email: Joi.string().email().required(),
});

export interface AdherentEmailRequest {
    email: string
}

export const verifAdherent = Joi.object<VerifAdherent>({
    email: Joi.string().email().required(),
    numTel: Joi.string().required(),

}).options({ abortEarly: false })

export interface VerifAdherent {
    email: string
    numTel: string
}

export const LoginValidationValidation = Joi.object<LoginValidationValidationRequest>({
    email: Joi.string().email().required(),
    motDePasse: Joi.string().required(),
}).options({ abortEarly: false });

export interface LoginValidationValidationRequest {
    email: string
    motDePasse: string
}