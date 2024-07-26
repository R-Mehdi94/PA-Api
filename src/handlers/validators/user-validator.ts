import Joi, { number } from "joi";
import { User, UserRole } from "../../database/entities/user";

export const createUserValidation = Joi.object<CreateUserValidationRequest>({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    email: Joi.string().email().required(),
    motDePasse: Joi.string().required(),
    numTel: Joi.string().min(10).max(10).required(),
    profession: Joi.string().required(),
    role: Joi.string().valid(...Object.values(UserRole)).required(),
    dateInscription: Joi.date().required(),
    estBenevole: Joi.boolean().required()
}).options({ abortEarly: false });

export interface CreateUserValidationRequest {
    nom: string
    prenom: string
    email: string
    motDePasse: string
    numTel: string
    profession: string
    role: UserRole
    dateInscription: Date
    estBenevole: boolean
}

export const userIdValidation = Joi.object<UserIdRequest>({
    id: Joi.number().required(),
    token: Joi.string().required()
});

export interface UserIdRequest {
    id: number
    token: string
}

export const getIdToken = Joi.object<GetIdToken>({
    id: Joi.number().required(),
    token: Joi.string().required(),
    name: Joi.string().required()
});

export interface GetIdToken {
    id: number
    token: string
    name:string
}


export const userGetBlobValidation = Joi.object<UserGetBlobRequest>({
    id: Joi.number().required(),
    token: Joi.string().required(),
    blobName: Joi.string().required()
});

export interface UserGetBlobRequest {
    id: number
    token: string
    blobName: string
}

export const updateUserValidation = Joi.object<UpdateUserRequest>({
    id: Joi.number().required(),
    token: Joi.string().required(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    email: Joi.string().email().optional(),
    numTel: Joi.string().min(10).max(10).optional(),
    profession: Joi.string().optional(),
    motDePasse: Joi.string().optional(),
    role: Joi.string().valid(...Object.values(UserRole)).optional(),
    estBenevole: Joi.boolean().optional(),
    estEnLigne : Joi.boolean().optional(),
    idAdmin: Joi.number().optional()
});

export interface UpdateUserRequest {
    id: number
    token: string
    nom?: string
    prenom?: string
    email?: string
    numTel?: string
    profession?: string
    motDePasse?: string
    role?: UserRole
    estBenevole?: boolean   
    estEnLigne?: boolean
    idAdmin?: number
}

export const listUserValidation = Joi.object<ListUserRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    numTel: Joi.string().min(10).max(10).optional(),
    profession: Joi.string().optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid(...Object.values(UserRole)).optional(),
    estBenevole: Joi.boolean().optional(),
    estEnLigne : Joi.boolean().optional()
});

export interface ListUserRequest {
    page: number
    limit: number
    nom?: string
    prenom?: string
    email?: string
    numTel?: string
    profession?: string
    role?: UserRole
    estBenevole?: boolean
    estEnLigne?: boolean
}

export const LoginUserValidation = Joi.object<LoginUserValidationRequest>({
    email: Joi.string().email().required(),
    motDePasse: Joi.string().required(),
}).options({ abortEarly: false });

export interface LoginUserValidationRequest {
    email: string
    motDePasse: string
}