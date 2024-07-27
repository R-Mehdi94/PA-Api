import { DataSource } from "typeorm";
import { Demande, StatutDemande, TypeDemande } from "../database/entities/demande";
import { Adherent } from "../database/entities/adherent";
import { Visiteur } from "../database/entities/visiteur";

export interface ListDemandeRequest {
    page: number
    limit: number
    type?: TypeDemande
    statut?: StatutDemande
    adherent?: number
    visiteur?: number
}

export interface UpdateDemandeParams {
    type?: TypeDemande
    statut?: StatutDemande
    adherent?: Adherent
    visiteur?: Visiteur
}

export class DemandeUsecase {
    constructor(private readonly db: DataSource) { }

    async listDemandes(listDemandeRequest: ListDemandeRequest): Promise<{ Demandes: Demande[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Demande, 'demande');
        if (listDemandeRequest.type) {
            query.andWhere("demande.type = :type", { type: listDemandeRequest.type });
        }

        if (listDemandeRequest.statut) {
            query.andWhere("demande.statut = :statut", { statut: listDemandeRequest.statut });
        }



        if (listDemandeRequest.adherent) {
            query.andWhere("demande.adherentId = :adherent", { adherent: listDemandeRequest.adherent });
        }

        if (listDemandeRequest.visiteur) {
            query.andWhere("demande.visiteurId = :visiteur", { visiteur: listDemandeRequest.visiteur });
        }

        query.leftJoinAndSelect('demande.adherent', 'adherent')
            .leftJoinAndSelect('demande.visiteur', 'visiteur')
            .leftJoinAndSelect('demande.autreDemandes', 'autreDemandes')
            .leftJoinAndSelect('demande.evenementDemandes', 'evenementDemandes')
            .leftJoinAndSelect('demande.aideProjetDemandes', 'aideProjetDemandes')
            .leftJoinAndSelect('demande.parrainageDemandes', 'parrainageDemandes')
            .skip((listDemandeRequest.page - 1) * listDemandeRequest.limit)
            .take(listDemandeRequest.limit);

        const [Demandes, totalCount] = await query.getManyAndCount();
        return {
            Demandes,
            totalCount
        };
    }

    async getOneDemande(id: number): Promise<Demande | null> {
        const query = this.db.createQueryBuilder(Demande, 'demande')
            .leftJoinAndSelect('demande.adherent', 'adherent')
            .leftJoinAndSelect('demande.visiteur', 'visiteur')
            .leftJoinAndSelect('demande.autreDemandes', 'autreDemandes')
            .leftJoinAndSelect('demande.evenementDemandes', 'evenementDemandes')
            .leftJoinAndSelect('demande.aideProjetDemandes', 'aideProjetDemandes')
            .leftJoinAndSelect('demande.parrainageDemandes', 'parrainageDemandes')
            .where("demande.id = :id", { id: id });

        const demande = await query.getOne();

        if (!demande) {
            console.log({ error: `Demande ${id} not found` });
            return null;
        }
        return demande;
    }

    async updateDemande(id: number, { type, statut, adherent, visiteur }: UpdateDemandeParams): Promise<Demande | string | null> {
        const repo = this.db.getRepository(Demande);
        const demandeFound = await repo.findOneBy({ id });
        if (demandeFound === null) return null;

        if (type === undefined && statut === undefined && adherent === undefined && visiteur === undefined) {
            return "No changes";
        }

        if (type) {
            demandeFound.type = type;
        }
        if (statut) {
            demandeFound.statut = statut;
        }

        if (adherent) {
            demandeFound.adherent = adherent;
        }
        if (visiteur) {
            demandeFound.visiteur = visiteur;
        }

        const demandeUpdate = await repo.save(demandeFound);
        return demandeUpdate;
    }
}
