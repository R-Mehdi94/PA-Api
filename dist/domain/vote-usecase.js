"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteUsecase = void 0;
const vote_1 = require("../database/entities/vote");
class VoteUsecase {
    constructor(db) {
        this.db = db;
    }
    listVotes(listVoteRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(vote_1.Vote, 'vote');
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
            const [Votes, totalCount] = yield query.getManyAndCount();
            return {
                Votes,
                totalCount
            };
        });
    }
    getOneVote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(vote_1.Vote, 'vote')
                .leftJoinAndSelect('vote.proposition', 'proposition')
                .leftJoinAndSelect('vote.user', 'user')
                .where("vote.id = :id", { id: id });
            const vote = yield query.getOne();
            if (!vote) {
                console.log({ error: `Vote ${id} not found` });
                return null;
            }
            return vote;
        });
    }
    updateVote(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { choix, numTour, proposition, user }) {
            const repo = this.db.getRepository(vote_1.Vote);
            const voteFound = yield repo.findOneBy({ id });
            if (voteFound === null)
                return null;
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
            const voteUpdate = yield repo.save(voteFound);
            return voteUpdate;
        });
    }
}
exports.VoteUsecase = VoteUsecase;
