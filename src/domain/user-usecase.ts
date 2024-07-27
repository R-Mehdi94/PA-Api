import { DataSource, DeleteResult } from "typeorm";
import { User, UserRole } from "../database/entities/user";
import { Token } from "../database/entities/token";

export interface ListUserRequest {
    page: number
    limit: number
    nom?: string
    prenom?: string
    email?: string
    numTel?: string
    profession?: string
    role?: UserRole
    dateInscription?: Date
    estBenevole?: boolean
    estEnLigne?: boolean
}

export interface UpdateUserParams {
    nom?: string
    prenom?: string
    email?: string
    motDePasse?: string
    numTel?: string
    profession?: string
    role?: UserRole
    dateInscription?: Date
    estBenevole?: boolean
    estEnLigne?: boolean
}

export class UserUsecase {
    constructor(private readonly db: DataSource) { }

    async getUserEmail(): Promise<any | null> {

        const entityManager = this.db.getRepository(User);

        const sqlQuery = `SELECT GROUP_CONCAT(email SEPARATOR ', ') AS emails FROM user;`;

        const visiteurEmails = await entityManager.query(sqlQuery);

        return visiteurEmails;
    }


    async deleteToken(id: number): Promise<DeleteResult> {

        const TokenDelete = await this.db.createQueryBuilder().delete().from(Token).where("userId = :id", { id: id }).andWhere("blobName IS NOT NULL").execute();

        return TokenDelete;

    }

    async verifUser(id: number, token: string): Promise<boolean> {  
        const user = await this.getOneUser(id);
        if (!user) {
            return false;
        }
    
        for (const element of user.tokens) {
            if (element.token === token) {
                return true;
            }
        }
        return false;
    }

    async verifAcces(userId:number, funcId:number):Promise<boolean>{
        const entityManager = this.db;

        const sqlQuery = `
        select count(*) from droit where userId = ? and fonctionnaliteId = ?;`;

        const query = await entityManager.query(sqlQuery, [userId, funcId]);

        return query;
    }

    async listUsers(listUserRequest: ListUserRequest): Promise<{ Users: User[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(User, 'user');
        if (listUserRequest.nom) {
            query.andWhere("user.nom = :nom", { nom: listUserRequest.nom });
        }

        if (listUserRequest.prenom) {
            query.andWhere("user.prenom = :prenom", { prenom: listUserRequest.prenom });
        }

        if (listUserRequest.email) {
            query.andWhere("user.email = :email", { email: listUserRequest.email });
        }

        if (listUserRequest.numTel) {
            query.andWhere("user.numTel = :numTel", { numTel: listUserRequest.numTel });
        }

        if (listUserRequest.profession) {
            query.andWhere("user.profession = :profession", { profession: listUserRequest.profession });
        }

        if (listUserRequest.role) {
            query.andWhere("user.role = :role", { role: listUserRequest.role });
        }

        if (listUserRequest.dateInscription) {
            query.andWhere("user.dateInscription = :dateInscription", { dateInscription: listUserRequest.dateInscription });
        }

        if (listUserRequest.estBenevole !== undefined) {
            query.andWhere("user.estBenevole = :estBenevole", { estBenevole: listUserRequest.estBenevole });
        }

        if (listUserRequest.estEnLigne !== undefined) {
            query.andWhere("user.estEnLigne = :estEnLigne", { estEnLigne: listUserRequest.estEnLigne });
        }

        query.leftJoinAndSelect('user.taches', 'taches')
            .leftJoinAndSelect('user.parrainageDemandes', 'parrainageDemandes')
            .leftJoinAndSelect('user.parraine', 'parraine')
            .leftJoinAndSelect('user.tokens', 'tokens')
            .leftJoinAndSelect('user.participationsAg', 'participationsAg')
            .leftJoinAndSelect('user.votes', 'votes')
            .leftJoinAndSelect('user.dossiers', 'dossiers')
            .leftJoinAndSelect('user.evenementUsers', 'evenementUsers')
            .skip((listUserRequest.page - 1) * listUserRequest.limit)
            .take(listUserRequest.limit);

        const [Users, totalCount] = await query.getManyAndCount();
        return {
            Users,
            totalCount
        };
    }

    async getOneUser(id: number): Promise<User | null> {
        const query = this.db.createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.taches', 'taches')
            .leftJoinAndSelect('user.parrainageDemandes', 'parrainageDemandes')
            .leftJoinAndSelect('user.parraine', 'parraine')
            .leftJoinAndSelect('user.tokens', 'tokens')
            .leftJoinAndSelect('user.participationsAg', 'participationsAg')
            .leftJoinAndSelect('user.votes', 'votes')
            .leftJoinAndSelect('user.dossiers', 'dossiers')
            .leftJoinAndSelect('user.evenementUsers', 'evenementUsers')
            .where("user.id = :id", { id: id });

        const user = await query.getOne();

        if (!user) {
            console.log({ error: `User ${id} not found` });
            return null;
        }
        return user;
    }

    async updateUser(id: number, { nom, prenom, email, motDePasse, numTel, profession, role, dateInscription, estBenevole, estEnLigne }: UpdateUserParams): Promise<User | string | null> {
        const repo = this.db.getRepository(User);
        const userFound = await repo.findOneBy({ id });
        if (userFound === null) return null;

        if (nom === undefined && prenom === undefined && email === undefined && motDePasse === undefined && numTel === undefined && profession === undefined && role === undefined && dateInscription === undefined && estBenevole === undefined && estEnLigne === undefined) {
            return "No changes";
        }

        if (nom) {
            userFound.nom = nom;
        }
        if (prenom) {
            userFound.prenom = prenom;
        }
        if (email) {
            userFound.email = email;
        }
        if (motDePasse) {
            userFound.motDePasse = motDePasse;
        }
        if (numTel) {
            userFound.numTel = numTel;
        }
        if (profession) {
            userFound.profession = profession;
        }
        if (role) {
            userFound.role = role;
        }
        if (dateInscription) {
            userFound.dateInscription = dateInscription;
        }
        if (estBenevole !== undefined) {
            userFound.estBenevole = estBenevole;
        }
        if (estEnLigne !== undefined) {
            userFound.estEnLigne = estEnLigne;
        }

        const userUpdate = await repo.save(userFound);
        return userUpdate;
    }
}

    
    

    

    


