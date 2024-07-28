import { DataSource } from "typeorm";
import { Visiteur } from "../database/entities/visiteur";

export interface ListVisiteurRequest {
    page: number
    limit: number
    email?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    profession?: string
    estBanie?: boolean
}

export interface UpdateVisiteurParams {
    email?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    profession?: string
    estBanie?: boolean
}

export class VisiteurUsecase {
    constructor(private readonly db: DataSource) { }

    async verifVisiteur(email:string): Promise<any | null> {

        const entityManager = this.db.getRepository(Visiteur);

        const sqlQuery = `select count(*) from adherent where email like ?;`;

        const verifVisiteur = await entityManager.query(sqlQuery, [email]);

        return verifVisiteur;
    }

    async listVisiteurs(listVisiteurRequest: ListVisiteurRequest): Promise<{ Visiteurs: Visiteur[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Visiteur, 'visiteur');
        if (listVisiteurRequest.email) {
            query.andWhere("visiteur.email = :email", { email: listVisiteurRequest.email });
        }

        if (listVisiteurRequest.nom) {
            query.andWhere("visiteur.nom = :nom", { nom: listVisiteurRequest.nom });
        }

        if (listVisiteurRequest.prenom) {
            query.andWhere("visiteur.prenom = :prenom", { prenom: listVisiteurRequest.prenom });
        }

        if (listVisiteurRequest.age) {
            query.andWhere("visiteur.age = :age", { age: listVisiteurRequest.age });
        }

        if (listVisiteurRequest.numTel) {
            query.andWhere("visiteur.numTel = :numTel", { numTel: listVisiteurRequest.numTel });
        }

        if (listVisiteurRequest.profession) {
            query.andWhere("visiteur.profession = :profession", { profession: listVisiteurRequest.profession });
        }

        if (listVisiteurRequest.estBanie !== undefined) {
            query.andWhere("visiteur.estBanie = :estBanie", { estBanie: listVisiteurRequest.estBanie });
        }

        query.leftJoinAndSelect('visiteur.inscriptions', 'inscriptions')
            .leftJoinAndSelect('visiteur.transactions', 'transactions')
            .leftJoinAndSelect('visiteur.demandes', 'demandes')

            .skip((listVisiteurRequest.page - 1) * listVisiteurRequest.limit)
            .take(listVisiteurRequest.limit);

        const [Visiteurs, totalCount] = await query.getManyAndCount();
        return {
            Visiteurs,
            totalCount
        };
    }

    async getOneVisiteur(id: number): Promise<Visiteur | null> {
        const query = this.db.createQueryBuilder(Visiteur, 'visiteur')
            .leftJoinAndSelect('visiteur.inscriptions', 'inscriptions')
            .leftJoinAndSelect('visiteur.transactions', 'transactions')
            .leftJoinAndSelect('visiteur.demandes', 'demandes')
            .where("visiteur.id = :id", { id: id });

        const visiteur = await query.getOne();

        if (!visiteur) {
            console.log({ error: `Visiteur ${id} not found` });
            return null;
        }
        return visiteur;
    }

    async updateVisiteur(id: number, { email, nom, prenom, age, numTel, profession, estBanie }: UpdateVisiteurParams): Promise<Visiteur | string | null> {
        const repo = this.db.getRepository(Visiteur);
        const visiteurFound = await repo.findOneBy({ id });
        if (visiteurFound === null) return null;

        if (email === undefined && nom === undefined && prenom === undefined && age === undefined && numTel === undefined && profession === undefined && estBanie === undefined) {
            return "No changes";
        }

        if (email) {
            visiteurFound.email = email;
        }
        if (nom) {
            visiteurFound.nom = nom;
        }
        if (prenom) {
            visiteurFound.prenom = prenom;
        }
        if (age !== undefined) {
            visiteurFound.age = age;
        }
        if (numTel) {
            visiteurFound.numTel = numTel;
        }
        if (profession) {
            visiteurFound.profession = profession;
        }
        if (estBanie !== undefined) {
            visiteurFound.estBanie = estBanie;
        }

        const visiteurUpdate = await repo.save(visiteurFound);
        return visiteurUpdate;
    }
}
