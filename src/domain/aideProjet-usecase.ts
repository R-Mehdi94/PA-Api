import { DataSource } from "typeorm";
import { AideProjet } from "../database/entities/aideProjet";
import { Adherent } from "../database/entities/adherent";
import { Visiteur } from "../database/entities/visiteur";

export interface ListAideProjetRequest {
    page: number
    limit: number
    titre?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
    visiteur?: number
    adherent?: number
}

export interface UpdateAideProjetParams {
    titre?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
    visiteur?: Visiteur
    adherent?: Adherent
}

export class AideProjetUsecase {
    constructor(private readonly db: DataSource) { }

    async listAideProjets(listAideProjetRequest: ListAideProjetRequest): Promise<{ AideProjets: AideProjet[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(AideProjet, 'aideProjet');
        if (listAideProjetRequest.titre) {
            query.andWhere("aideProjet.titre = :titre", { titre: listAideProjetRequest.titre });
        }

        if (listAideProjetRequest.descriptionProjet) {
            query.andWhere("aideProjet.descriptionProjet = :descriptionProjet", { descriptionProjet: listAideProjetRequest.descriptionProjet });
        }

        if (listAideProjetRequest.budget !== undefined) {
            query.andWhere("aideProjet.budget = :budget", { budget: listAideProjetRequest.budget });
        }

        if (listAideProjetRequest.deadline) {
            query.andWhere("aideProjet.deadline = :deadline", { deadline: listAideProjetRequest.deadline });
        }

        if (listAideProjetRequest.visiteur) {
            query.andWhere("aideProjet.visiteurId = :visiteur", { visiteur: listAideProjetRequest.visiteur });
        }

        if (listAideProjetRequest.adherent) {
            query.andWhere("aideProjet.adherentId = :adherent", { adherent: listAideProjetRequest.adherent });
        }

        query.leftJoinAndSelect('aideProjet.visiteur', 'visiteur')
            .leftJoinAndSelect('aideProjet.adherent', 'adherent')
            .skip((listAideProjetRequest.page - 1) * listAideProjetRequest.limit)
            .take(listAideProjetRequest.limit);

        const [AideProjets, totalCount] = await query.getManyAndCount();
        return {
            AideProjets,
            totalCount
        };
    }

    async getOneAideProjet(id: number): Promise<AideProjet | null> {
        const query = this.db.createQueryBuilder(AideProjet, 'aideProjet')
            .leftJoinAndSelect('aideProjet.visiteur', 'visiteur')
            .leftJoinAndSelect('aideProjet.adherent', 'adherent')
            .where("aideProjet.id = :id", { id: id });

        const aideProjet = await query.getOne();

        if (!aideProjet) {
            console.log({ error: `AideProjet ${id} not found` });
            return null;
        }
        return aideProjet;
    }

    async updateAideProjet(id: number, { titre, descriptionProjet, budget, deadline, visiteur, adherent }: UpdateAideProjetParams): Promise<AideProjet | string | null> {
        const repo = this.db.getRepository(AideProjet);
        const aideProjetFound = await repo.findOneBy({ id });
        if (aideProjetFound === null) return null;

        if (titre === undefined && descriptionProjet === undefined && budget === undefined && deadline === undefined && visiteur === undefined && adherent === undefined) {
            return "No changes";
        }

        if (titre) {
            aideProjetFound.titre = titre;
        }
        if (descriptionProjet) {
            aideProjetFound.descriptionProjet = descriptionProjet;
        }
        if (budget !== undefined) {
            aideProjetFound.budget = budget;
        }
        if (deadline !== undefined) {
            aideProjetFound.deadline = deadline;
        }
        if (visiteur) {
            aideProjetFound.visiteur = visiteur;
        }
        if (adherent) {
            aideProjetFound.adherent = adherent;
        }

        const aideProjetUpdate = await repo.save(aideProjetFound);
        return aideProjetUpdate;
    }
}
