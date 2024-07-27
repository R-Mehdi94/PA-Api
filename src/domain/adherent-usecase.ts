import { DataSource, DeleteResult } from "typeorm";
import { Adherent } from "../database/entities/adherent";
import { User } from "../database/entities/user";
import { Token } from "../database/entities/token";

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

export interface UpdateAdherentParams {
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

export class AdherentUsecase {
    constructor(private readonly db: DataSource) { }

    async deleteToken(id: number): Promise<DeleteResult> {

        const TokenDelete = await this.db.createQueryBuilder().delete().from(Token).where("adherentId = :id", { id: id }).andWhere("blobName IS NULL").execute();

        return TokenDelete;

    }

    async verifAdherentToken(id: number, token: string): Promise<boolean> { 
        const adherent = await this.getOneAdherent(id);
        if (!adherent) {
            return false;
        }
    
        for (const element of adherent.tokens) {
            if (element.token === token) {
                return true;
            }
        }
        return false;
    }

    async verifAdherent(email:string,numTel: string): Promise<any | null> {

        const entityManager = this.db.getRepository(Adherent);

        const sqlQuery = `select count(*) from adherent where email like ? and numTel = ?;`;

        const verifVisiteur = await entityManager.query(sqlQuery, [email,numTel]);

        return verifVisiteur;
    }

    async getAdherentEmail(): Promise<any | null> {

        const entityManager = this.db.getRepository(Adherent);

        const sqlQuery = `SELECT GROUP_CONCAT(email SEPARATOR ', ') AS emails FROM adherent;`;

        const visiteurEmails = await entityManager.query(sqlQuery);

        return visiteurEmails;
    }

    async verifEmailAdherent(email: string): Promise<any | null> {

        const entityManager = this.db.getRepository(Adherent);

        const sqlQuery = `select count(*) as verif from adherent where email=?;`;

        const verifEmail = await entityManager.query(sqlQuery, [email]);

        return verifEmail;
    }

    async listAdherents(listAdherentRequest: ListAdherentRequest): Promise<{ Adherents: Adherent[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Adherent, 'adherent');
        if (listAdherentRequest.email) {
            query.andWhere("adherent.email = :email", { email: listAdherentRequest.email });
        }

        if (listAdherentRequest.nom) {
            query.andWhere("adherent.nom = :nom", { nom: listAdherentRequest.nom });
        }

        if (listAdherentRequest.prenom) {
            query.andWhere("adherent.prenom = :prenom", { prenom: listAdherentRequest.prenom });
        }

        if (listAdherentRequest.age) {
            query.andWhere("adherent.age = :age", { age: listAdherentRequest.age });
        }

        if (listAdherentRequest.numTel) {
            query.andWhere("adherent.numTel = :numTel", { numTel: listAdherentRequest.numTel });
        }

        if (listAdherentRequest.adresse) {
            query.andWhere("adherent.adresse = :adresse", { adresse: listAdherentRequest.adresse });
        }

        if (listAdherentRequest.profession) {
            query.andWhere("adherent.profession = :profession", { profession: listAdherentRequest.profession });
        }

        if (listAdherentRequest.estBanie !== undefined) {
            query.andWhere("adherent.estBanie = :estBanie", { estBanie: listAdherentRequest.estBanie });
        }

        if (listAdherentRequest.estBenevole !== undefined) {
            query.andWhere("adherent.estBenevole = :estBenevole", { estBenevole: listAdherentRequest.estBenevole });
        }

        if (listAdherentRequest.parrain) {
            query.andWhere("adherent.parrainId = :parrain", { parrain: listAdherentRequest.parrain });
        }

        query.leftJoinAndSelect('adherent.parrain', 'parrain')
            .leftJoinAndSelect('adherent.inscriptions', 'inscriptions')
            .leftJoinAndSelect('adherent.cotisations', 'cotisations')
            .leftJoinAndSelect('adherent.tokens', 'tokens')
            .leftJoinAndSelect('adherent.demandes', 'demandes')
            .skip((listAdherentRequest.page - 1) * listAdherentRequest.limit)
            .take(listAdherentRequest.limit);

        const [Adherents, totalCount] = await query.getManyAndCount();
        return {
            Adherents,
            totalCount
        };
    }

    async getOneAdherent(id: number): Promise<Adherent | null> {
        const query = this.db.createQueryBuilder(Adherent, 'adherent')
            .leftJoinAndSelect('adherent.parrain', 'parrain')
            .leftJoinAndSelect('adherent.inscriptions', 'inscriptions')
            .leftJoinAndSelect('adherent.cotisations', 'cotisations')
            .leftJoinAndSelect('adherent.tokens', 'tokens')
            .where("adherent.id = :id", { id: id });

        const adherent = await query.getOne();

        if (!adherent) {
            console.log({ error: `Adherent ${id} not found` });
            return null;
        }
        return adherent;
    }

    async updateAdherent(id: number, { email, motDePasse, nom, prenom, age, numTel, adresse, profession, estBanie, estBenevole, parrain }: UpdateAdherentParams): Promise<Adherent | string | null> {
        const repo = this.db.getRepository(Adherent);
        const adherentFound = await repo.findOneBy({ id });
        if (adherentFound === null) return null;

        if (email === undefined && motDePasse === undefined && nom === undefined && prenom === undefined && age === undefined && numTel === undefined && adresse === undefined && profession === undefined && estBanie === undefined && estBenevole === undefined && parrain === undefined) {
            return "No changes";
        }

        if (email) {
            adherentFound.email = email;
        }
        if (motDePasse) {
            adherentFound.motDePasse = motDePasse;
        }
        if (nom) {
            adherentFound.nom = nom;
        }
        if (prenom) {
            adherentFound.prenom = prenom;
        }
        if (age !== undefined) {
            adherentFound.age = age;
        }
        if (numTel) {
            adherentFound.numTel = numTel;
        }
        if (adresse) {
            adherentFound.adresse = adresse;
        }
        if (profession) {
            adherentFound.profession = profession;
        }
        if (estBanie !== undefined) {
            adherentFound.estBanie = estBanie;
        }
        if (estBenevole !== undefined) {
            adherentFound.estBenevole = estBenevole;
        }
        if (parrain) {
            adherentFound.parrain = parrain;
        }

        const adherentUpdate = await repo.save(adherentFound);
        return adherentUpdate;
    }
}
