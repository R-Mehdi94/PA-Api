import { DataSource } from "typeorm";
import { Sondage } from "../database/entities/sondage";
import { TypeSondage } from "../database/entities/sondage";

export interface ListSondageRequest {
    page: number
    limit: number
    nom?: string
    typeSondage?: TypeSondage
    dateDebut?: Date
    dateFin?: Date
}

export interface UpdateSondageParams {
    nom?: string
    typeSondage?: TypeSondage
    dateDebut?: Date
    dateFin?: Date
    description?: string
}

export class SondageUsecase {
    constructor(private readonly db: DataSource) { }

    async listSondages(listSondageRequest: ListSondageRequest): Promise<{ Sondages: Sondage[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Sondage, 'sondage');
        if (listSondageRequest.nom) {
            query.andWhere("sondage.nom = :nom", { nom: listSondageRequest.nom });
        }

        if (listSondageRequest.typeSondage) {
            query.andWhere("sondage.typeSondage = :typeSondage", { typeSondage: listSondageRequest.typeSondage });
        }

        if (listSondageRequest.dateDebut) {
            query.andWhere("sondage.dateDebut = :dateDebut", { dateDebut: listSondageRequest.dateDebut });
        }

        if (listSondageRequest.dateFin) {
            query.andWhere("sondage.dateFin = :dateFin", { dateFin: listSondageRequest.dateFin });
        }

        query.leftJoinAndSelect('sondage.propositions', 'propositions')
            .skip((listSondageRequest.page - 1) * listSondageRequest.limit)
            .take(listSondageRequest.limit);

        const [Sondages, totalCount] = await query.getManyAndCount();
        return {
            Sondages,
            totalCount
        };
    }

    async getOneSondage(id: number): Promise<Sondage | null> {
        const query = this.db.createQueryBuilder(Sondage, 'sondage')
            .leftJoinAndSelect('sondage.propositions', 'propositions')
            .where("sondage.id = :id", { id: id });

        const sondage = await query.getOne();

        if (!sondage) {
            console.log({ error: `Sondage ${id} not found` });
            return null;
        }
        return sondage;
    }

    async updateSondage(id: number, { nom, typeSondage, dateDebut, dateFin, description }: UpdateSondageParams): Promise<Sondage | string | null> {
        const repo = this.db.getRepository(Sondage);
        const sondageFound = await repo.findOneBy({ id });
        if (sondageFound === null) return null;

        if (nom === undefined && typeSondage === undefined && dateDebut === undefined && dateFin === undefined && description === undefined) {
            return "No changes";
        }

        if (nom) {
            sondageFound.nom = nom;
        }
        if (typeSondage) {
            sondageFound.typeSondage = typeSondage;
        }
        if (dateDebut !== undefined) {
            sondageFound.dateDebut = dateDebut;
        }
        if (dateFin !== undefined) {
            sondageFound.dateFin = dateFin;
        }
        if (description) {
            sondageFound.description = description;
        }

        const sondageUpdate = await repo.save(sondageFound);
        return sondageUpdate;
    }
}
