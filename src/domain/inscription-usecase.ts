
import { DataSource } from "typeorm";
import { Inscription } from "../database/entities/inscription";
import { Evenement } from "../database/entities/evenement";
import { Visiteur } from "../database/entities/visiteur";
import { Adherent } from "../database/entities/adherent";

export interface ListInscriptionRequest {
    page: number
    limit: number
    evenement?: number
    visiteur?: number
    adherent?: number
}

export interface UpdateInscriptionParams {
    evenement?: Evenement
    visiteur?: Visiteur
    adherent?: Adherent
}

export class InscriptionUsecase {
    constructor(private readonly db: DataSource) { }

    async deleteInscriptionAdherent(idAdherent:number, idEvent:number): Promise<any | null> {

        const entityManager = this.db.getRepository(Inscription);
    
        const sqlQuery = `delete from inscription where adherentId like ? and evenementId = ?;`;
    
        const deleteInscriptionAdherent = await entityManager.query(sqlQuery, [idAdherent,idEvent]);
    
        return deleteInscriptionAdherent;
    }

    async deleteInscription(email:string, idEvent:number): Promise<any | null> {

        const entityManager = this.db.getRepository(Inscription);
    
        const sqlQuery = `delete from inscription where emailVisiteur like ? and evenementId = ?;`;
    
        const deleteInscription = await entityManager.query(sqlQuery, [email,idEvent]);
    
        return deleteInscription;
    }
    
    async verifEmail(email:string, id: number): Promise<any | null> {
    
        const entityManager = this.db.getRepository(Inscription);
    
        const sqlQuery = `select count(*) from inscription where emailVisiteur=? and evenementId=?;`;
    
        const verifEmail = await entityManager.query(sqlQuery, [email,id]);
    
        return verifEmail;
    }
    
    async nbPlace(id: number): Promise<any | null> {
    
        const entityManager = this.db.getRepository(Inscription);
    
        const sqlQuery = `select nbPlace from evenement where id=?;`;
    
        const nbPlace = await entityManager.query(sqlQuery, [id]);
    
        return nbPlace;
    }
    

    async listInscriptions(listInscriptionRequest: ListInscriptionRequest): Promise<{ Inscriptions: Inscription[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Inscription, 'inscription');
        if (listInscriptionRequest.evenement) {
            query.andWhere("inscription.evenementId = :evenement", { evenement: listInscriptionRequest.evenement });
        }

        if (listInscriptionRequest.visiteur) {
            query.andWhere("inscription.visiteurId = :visiteur", { visiteur: listInscriptionRequest.visiteur });
        }

        if (listInscriptionRequest.adherent) {
            query.andWhere("inscription.adherentId = :adherent", { adherent: listInscriptionRequest.adherent });
        }

        query.leftJoinAndSelect('inscription.evenement', 'evenement')
            .leftJoinAndSelect('inscription.visiteur', 'visiteur')
            .leftJoinAndSelect('inscription.adherent', 'adherent')
            .skip((listInscriptionRequest.page - 1) * listInscriptionRequest.limit)
            .take(listInscriptionRequest.limit);

        const [Inscriptions, totalCount] = await query.getManyAndCount();
        return {
            Inscriptions,
            totalCount
        };
    }

    async getOneInscription(id: number): Promise<Inscription | null> {
        const query = this.db.createQueryBuilder(Inscription, 'inscription')
            .leftJoinAndSelect('inscription.evenement', 'evenement')
            .leftJoinAndSelect('inscription.visiteur', 'visiteur')
            .leftJoinAndSelect('inscription.adherent', 'adherent')
            .where("inscription.id = :id", { id: id });

        const inscription = await query.getOne();

        if (!inscription) {
            console.log({ error: `Inscription ${id} not found` });
            return null;
        }
        return inscription;
    }

    async updateInscription(id: number, { evenement, visiteur, adherent }: UpdateInscriptionParams): Promise<Inscription | string | null> {
        const repo = this.db.getRepository(Inscription);
        const inscriptionFound = await repo.findOneBy({ id });
        if (inscriptionFound === null) return null;

        if (evenement === undefined && visiteur === undefined && adherent === undefined) {
            return "No changes";
        }

        if (evenement) {
            inscriptionFound.evenement = evenement;
        }
        if (visiteur) {
            inscriptionFound.visiteur = visiteur;
        }
        if (adherent) {
            inscriptionFound.adherent = adherent;
        }

        const inscriptionUpdate = await repo.save(inscriptionFound);
        return inscriptionUpdate;
    }
}
