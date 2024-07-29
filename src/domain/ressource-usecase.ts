import { DataSource } from "typeorm";
import { Ressource } from "../database/entities/ressource";
import { TypeRessource } from "../database/entities/ressource";

export interface ListRessourceRequest {
    page: number
    limit: number
    nom?: string
    type?: TypeRessource
    quantite?: number
    sync_status?: string
    emplacement?: string
}

export interface UpdateRessourceParams {
    nom?: string
    type?: TypeRessource
    quantite?: number
    sync_status?: string
    emplacement?: string
}

export class RessourceUsecase {
    constructor(private readonly db: DataSource) { }

    async listRessources(listRessourceRequest: ListRessourceRequest): Promise<{ Ressources: Ressource[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Ressource, 'ressource');
        if (listRessourceRequest.nom) {
            query.andWhere("ressource.nom = :nom", { nom: listRessourceRequest.nom });
        }

        if (listRessourceRequest.type) {
            query.andWhere("ressource.type = :type", { type: listRessourceRequest.type });
        }

        if (listRessourceRequest.quantite !== undefined) {
            query.andWhere("ressource.quantite = :quantite", { quantite: listRessourceRequest.quantite });
        }

        if (listRessourceRequest.sync_status) {
            query.andWhere("ressource.sync_status = :sync_status", { sync_status: listRessourceRequest.sync_status });
        }

        if (listRessourceRequest.emplacement) {
            query.andWhere("ressource.emplacement = :emplacement", { emplacement: listRessourceRequest.emplacement });
        }

        query.leftJoinAndSelect('ressource.evenementRessources', 'evenementRessources')
            .leftJoinAndSelect('ressource.evenementUsers', 'evenementUsers')
            .leftJoinAndSelect('ressource.taches', 'taches')
            .skip((listRessourceRequest.page - 1) * listRessourceRequest.limit)
            .take(listRessourceRequest.limit);

        const [Ressources, totalCount] = await query.getManyAndCount();
        return {
            Ressources,
            totalCount
        };
    }

    async getOneRessource(id: number): Promise<Ressource | null> {
        const query = this.db.createQueryBuilder(Ressource, 'ressource')
            .leftJoinAndSelect('ressource.evenementRessources', 'evenementRessources')
            .leftJoinAndSelect('ressource.evenementUsers', 'evenementUsers')
            .leftJoinAndSelect('ressource.taches', 'taches')
            .where("ressource.id = :id", { id: id });

        const ressource = await query.getOne();

        if (!ressource) {
            console.log({ error: `Ressource ${id} not found` });
            return null;
        }
        return ressource;
    }

    async updateRessource(id: number, { nom, type, quantite, sync_status, emplacement }: UpdateRessourceParams): Promise<Ressource | string | null> {
        const repo = this.db.getRepository(Ressource);
        const ressourceFound = await repo.findOneBy({ id });
        if (ressourceFound === null) return null;

        if (nom === undefined && type === undefined && quantite === undefined && sync_status === undefined && emplacement === undefined) {
            return "No changes";
        }

        if (nom) {
            ressourceFound.nom = nom;
        }
        if (type) {
            ressourceFound.type = type;
        }
        if (quantite !== undefined) {
            ressourceFound.quantite = quantite;
        }
        if (sync_status) {
            ressourceFound.sync_status = sync_status;
        }
        if (emplacement) {
            ressourceFound.emplacement = emplacement;
        }

        const ressourceUpdate = await repo.save(ressourceFound);
        return ressourceUpdate;
    }
}
