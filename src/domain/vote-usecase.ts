import { DataSource } from "typeorm";
import { Vote } from "../database/entities/vote";
import { Proposition } from "../database/entities/proposition";
import { User } from "../database/entities/user";

export interface ListVoteRequest {
    page: number
    limit: number
    choix?: string
    numTour?: number
    proposition?: number
    user?: number
}

export interface UpdateVoteParams {
    choix?: string
    numTour?: number
    proposition?: Proposition
    user?: User
}

export class VoteUsecase {
    constructor(private readonly db: DataSource) { }

    async listVotes(listVoteRequest: ListVoteRequest): Promise<{ Votes: Vote[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Vote, 'vote');
        if (listVoteRequest.choix) {
            query.andWhere("vote.choix = :choix", { choix: listVoteRequest.choix });
        }

        if (listVoteRequest.numTour) {
            query.andWhere("vote.numTour = :numTour", { numTour: listVoteRequest.numTour });
        }

        if (listVoteRequest.proposition) {
            query.andWhere("vote.propositionId = :proposition", { proposition: listVoteRequest.proposition });
        }

        if (listVoteRequest.user) {
            query.andWhere("vote.userId = :user", { user: listVoteRequest.user });
        }

        query.leftJoinAndSelect('vote.proposition', 'proposition')
            .leftJoinAndSelect('vote.user', 'user')
            .skip((listVoteRequest.page - 1) * listVoteRequest.limit)
            .take(listVoteRequest.limit);

        const [Votes, totalCount] = await query.getManyAndCount();
        return {
            Votes,
            totalCount
        };
    }

    async getOneVote(id: number): Promise<Vote | null> {
        const query = this.db.createQueryBuilder(Vote, 'vote')
            .leftJoinAndSelect('vote.proposition', 'proposition')
            .leftJoinAndSelect('vote.user', 'user')
            .where("vote.id = :id", { id: id });

        const vote = await query.getOne();

        if (!vote) {
            console.log({ error: `Vote ${id} not found` });
            return null;
        }
        return vote;
    }

    async updateVote(id: number, { choix, numTour, proposition, user }: UpdateVoteParams): Promise<Vote | string | null> {
        const repo = this.db.getRepository(Vote);
        const voteFound = await repo.findOneBy({ id });
        if (voteFound === null) return null;

        if (choix === undefined && numTour === undefined && proposition === undefined && user === undefined) {
            return "No changes";
        }

        if (choix) {
            voteFound.choix = choix;
        }
        if (numTour !== undefined) {
            voteFound.numTour = numTour;
        }
        if (proposition) {
            voteFound.proposition = proposition;
        }
        if (user) {
            voteFound.user = user;
        }

        const voteUpdate = await repo.save(voteFound);
        return voteUpdate;
    }
}
