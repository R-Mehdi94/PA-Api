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
exports.AideProjetUsecase = void 0;
const aideProjet_1 = require("../database/entities/aideProjet");
class AideProjetUsecase {
    constructor(db) {
        this.db = db;
    }
    listAideProjets(listAideProjetRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(aideProjet_1.AideProjet, 'aideProjet');
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
            const [AideProjets, totalCount] = yield query.getManyAndCount();
            return {
                AideProjets,
                totalCount
            };
        });
    }
    getOneAideProjet(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(aideProjet_1.AideProjet, 'aideProjet')
                .leftJoinAndSelect('aideProjet.visiteur', 'visiteur')
                .leftJoinAndSelect('aideProjet.adherent', 'adherent')
                .where("aideProjet.id = :id", { id: id });
            const aideProjet = yield query.getOne();
            if (!aideProjet) {
                console.log({ error: `AideProjet ${id} not found` });
                return null;
            }
            return aideProjet;
        });
    }
    updateAideProjet(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { titre, descriptionProjet, budget, deadline, visiteur, adherent }) {
            const repo = this.db.getRepository(aideProjet_1.AideProjet);
            const aideProjetFound = yield repo.findOneBy({ id });
            if (aideProjetFound === null)
                return null;
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
            const aideProjetUpdate = yield repo.save(aideProjetFound);
            return aideProjetUpdate;
        });
    }
}
exports.AideProjetUsecase = AideProjetUsecase;
