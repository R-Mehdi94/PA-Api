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
exports.CotisationUsecase = void 0;
const cotisation_1 = require("../database/entities/cotisation");
class CotisationUsecase {
    constructor(db) {
        this.db = db;
    }
    listCotisations(listCotisationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(cotisation_1.Cotisation, 'cotisation');
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
            const [Cotisations, totalCount] = yield query.getManyAndCount();
            return {
                Cotisations,
                totalCount
            };
        });
    }
    getOneCotisation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(cotisation_1.Cotisation, 'cotisation')
                .leftJoinAndSelect('cotisation.user', 'user')
                .leftJoinAndSelect('cotisation.adherent', 'adherent')
                .where("cotisation.id = :id", { id: id });
            const cotisation = yield query.getOne();
            if (!cotisation) {
                console.log({ error: `Cotisation ${id} not found` });
                return null;
            }
            return cotisation;
        });
    }
    updateCotisation(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { type, Ajours, user, adherent }) {
            const repo = this.db.getRepository(cotisation_1.Cotisation);
            const cotisationFound = yield repo.findOneBy({ id });
            if (cotisationFound === null)
                return null;
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
            const cotisationUpdate = yield repo.save(cotisationFound);
            return cotisationUpdate;
        });
    }
}
exports.CotisationUsecase = CotisationUsecase;
