import { DataSource } from "typeorm";
import { Cotisation, typeCotisation } from "../database/entities/cotisation";
import { Adherent } from "../database/entities/adherent";
import { User } from "../database/entities/user";

export interface ListCotisationRequest {
    page: number
    limit: number
    type?: typeCotisation
    Ajours?: boolean
    user?: number
    adherent?: number
}

export interface UpdateCotisationParams {
    type?: typeCotisation
    Ajours?: boolean
    user?: User
    adherent?: Adherent
}

export class CotisationUsecase {
    constructor(private readonly db: DataSource) { }

    async listCotisations(listCotisationRequest: ListCotisationRequest): Promise<{ Cotisations: Cotisation[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Cotisation, 'cotisation');
        if (listCotisationRequest.type) {
            query.andWhere("cotisation.type = :type", { type: listCotisationRequest.type });
        }

        if (listCotisationRequest.Ajours !== undefined) {
            query.andWhere("cotisation.Ajours = :Ajours", { Ajours: listCotisationRequest.Ajours });
        }

        if (listCotisationRequest.user) {
            query.andWhere("cotisation.userId = :user", { user: listCotisationRequest.user });
        }

        if (listCotisationRequest.adherent) {
            query.andWhere("cotisation.adherentId = :adherent", { adherent: listCotisationRequest.adherent });
        }

        query.leftJoinAndSelect('cotisation.user', 'user')
            .leftJoinAndSelect('cotisation.adherent', 'adherent')
            .skip((listCotisationRequest.page - 1) * listCotisationRequest.limit)
            .take(listCotisationRequest.limit);

        const [Cotisations, totalCount] = await query.getManyAndCount();
        return {
            Cotisations,
            totalCount
        };
    }

    async getOneCotisation(id: number): Promise<Cotisation | null> {
        const query = this.db.createQueryBuilder(Cotisation, 'cotisation')
            .leftJoinAndSelect('cotisation.user', 'user')
            .leftJoinAndSelect('cotisation.adherent', 'adherent')
            .where("cotisation.id = :id", { id: id });

        const cotisation = await query.getOne();

        if (!cotisation) {
            console.log({ error: `Cotisation ${id} not found` });
            return null;
        }
        return cotisation;
    }

    async updateCotisation(id: number, { type, Ajours, user, adherent }: UpdateCotisationParams): Promise<Cotisation | string | null> {
        const repo = this.db.getRepository(Cotisation);
        const cotisationFound = await repo.findOneBy({ id });
        if (cotisationFound === null) return null;

        if (type === undefined && Ajours === undefined && user === undefined && adherent === undefined) {
            return "No changes";
        }

        if (type) {
            cotisationFound.type = type;
        }
        if (Ajours !== undefined) {
            cotisationFound.Ajours = Ajours;
        }
        if (user) {
            cotisationFound.user = user;
        }
        if (adherent) {
            cotisationFound.adherent = adherent;
        }

        const cotisationUpdate = await repo.save(cotisationFound);
        return cotisationUpdate;
    }
}
