import { DataSource } from "typeorm";
import { StatutTache, Tache } from "../database/entities/tache";
import { Ressource } from "../database/entities/ressource";
import { User } from "../database/entities/user";

export interface ListTacheRequest {
    page: number
    limit: number
    description?: string
    dateDebut?: Date
    dateFin?: Date
    statut?: StatutTache
    sync_status?: string
    responsable?: number
    ressource?: number
}

export interface UpdateTacheParams {
    description?: string
    dateDebut?: Date
    dateFin?: Date
    statut?: StatutTache
    sync_status?: string
    responsable?: User
    ressource?: Ressource
}

export class TacheUsecase {
    constructor(private readonly db: DataSource) { }

    async listTaches(listTacheRequest: ListTacheRequest): Promise<{ Taches: Tache[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Tache, 'tache');
        if (listTacheRequest.description) {
            query.andWhere("tache.description = :description", { description: listTacheRequest.description });
        }

        if (listTacheRequest.dateDebut) {
            query.andWhere("tache.dateDebut = :dateDebut", { dateDebut: listTacheRequest.dateDebut });
        }

        if (listTacheRequest.dateFin) {
            query.andWhere("tache.dateFin = :dateFin", { dateFin: listTacheRequest.dateFin });
        }

        if (listTacheRequest.statut) {
            query.andWhere("tache.statut = :statut", { statut: listTacheRequest.statut });
        }

        if (listTacheRequest.sync_status) {
            query.andWhere("tache.sync_status = :sync_status", { sync_status: listTacheRequest.sync_status });
        }

        if (listTacheRequest.responsable) {
            query.andWhere("tache.responsableId = :responsable", { responsable: listTacheRequest.responsable });
        }

        if (listTacheRequest.ressource) {
            query.andWhere("tache.ressourceId = :ressource", { ressource: listTacheRequest.ressource });
        }

        query.leftJoinAndSelect('tache.responsable', 'responsable')
            .leftJoinAndSelect('tache.ressource', 'ressource')
            .skip((listTacheRequest.page - 1) * listTacheRequest.limit)
            .take(listTacheRequest.limit);

        const [Taches, totalCount] = await query.getManyAndCount();
        return {
            Taches,
            totalCount
        };
    }

    async getOneTache(id: number): Promise<Tache | null> {
        const query = this.db.createQueryBuilder(Tache, 'tache')
            .leftJoinAndSelect('tache.responsable', 'responsable')
            .leftJoinAndSelect('tache.ressource', 'ressource')
            .where("tache.id = :id", { id: id });

        const tache = await query.getOne();

        if (!tache) {
            console.log({ error: `Tache ${id} not found` });
            return null;
        }
        return tache;
    }

    async updateTache(id: number, { description, dateDebut, dateFin, statut, sync_status, responsable, ressource }: UpdateTacheParams): Promise<Tache | string | null> {
        const repo = this.db.getRepository(Tache);
        const tacheFound = await repo.findOneBy({ id });
        if (tacheFound === null) return null;

        if (description === undefined && dateDebut === undefined && dateFin === undefined && statut === undefined && sync_status === undefined && responsable === undefined && ressource === undefined) {
            return "No changes";
        }

        if (description) {
            tacheFound.description = description;
        }
        if (dateDebut !== undefined) {
            tacheFound.dateDebut = dateDebut;
        }
        if (dateFin !== undefined) {
            tacheFound.dateFin = dateFin;
        }
        if (statut) {
            tacheFound.statut = statut;
        }
        if (sync_status) {
            tacheFound.sync_status = sync_status;
        }
        if (responsable) {
            tacheFound.responsable = responsable;
        }
        if (ressource) {
            tacheFound.ressource = ressource;
        }

        const tacheUpdate = await repo.save(tacheFound);
        return tacheUpdate;
    }
}
