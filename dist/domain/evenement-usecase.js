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
exports.EvenementUsecase = void 0;
const evenement_1 = require("../database/entities/evenement");
class EvenementUsecase {
    constructor(db) {
        this.db = db;
    }
    nbPlacePlusUn(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(evenement_1.Evenement);
            const sqlQuery = `UPDATE evenement SET nbPlace = nbPlace+1 WHERE id = ?;`;
            const nbPlacePlusUn = yield entityManager.query(sqlQuery, [id]);
            return nbPlacePlusUn;
        });
    }
    nbPlaceMoinsUn(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(evenement_1.Evenement);
            const sqlQuery = `UPDATE evenement SET nbPlace = nbPlace-1 WHERE id = ?;`;
            const nbPlaceMoinsUn = yield entityManager.query(sqlQuery, [id]);
            return nbPlaceMoinsUn;
        });
    }
    listEvenements(listEvenementRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(evenement_1.Evenement, 'evenement');
            if (listEvenementRequest.nom) {
                query.andWhere("evenement.nom = :nom", { nom: listEvenementRequest.nom });
            }
            if (listEvenementRequest.date) {
                query.andWhere("evenement.date = :date", { date: listEvenementRequest.date });
            }
            if (listEvenementRequest.description) {
                query.andWhere("evenement.description = :description", { description: listEvenementRequest.description });
            }
            if (listEvenementRequest.lieu) {
                query.andWhere("evenement.lieu = :lieu", { lieu: listEvenementRequest.lieu });
            }
            if (listEvenementRequest.estReserve !== undefined) {
                query.andWhere("evenement.estReserve = :estReserve", { estReserve: listEvenementRequest.estReserve });
            }
            if (listEvenementRequest.nbPlace !== undefined) {
                query.andWhere("evenement.nbPlace = :nbPlace", { nbPlace: listEvenementRequest.nbPlace });
            }
            query.leftJoinAndSelect('evenement.evenementRessources', 'evenementRessources')
                .leftJoinAndSelect('evenement.inscriptions', 'inscriptions')
                .leftJoinAndSelect('evenement.evenementUsers', 'evenementUsers')
                .skip((listEvenementRequest.page - 1) * listEvenementRequest.limit)
                .take(listEvenementRequest.limit);
            const [Evenements, totalCount] = yield query.getManyAndCount();
            return {
                Evenements,
                totalCount
            };
        });
    }
    getOneEvenement(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(evenement_1.Evenement, 'evenement')
                .leftJoinAndSelect('evenement.evenementRessources', 'evenementRessources')
                .leftJoinAndSelect('evenement.inscriptions', 'inscriptions')
                .leftJoinAndSelect('evenement.evenementUsers', 'evenementUsers')
                .where("evenement.id = :id", { id: id });
            const evenement = yield query.getOne();
            if (!evenement) {
                console.log({ error: `Evenement ${id} not found` });
                return null;
            }
            return evenement;
        });
    }
    updateEvenement(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nom, date, description, lieu, estReserve, nbPlace }) {
            const repo = this.db.getRepository(evenement_1.Evenement);
            const evenementFound = yield repo.findOneBy({ id });
            if (evenementFound === null)
                return null;
            if (nom === undefined && date === undefined && description === undefined && lieu === undefined && estReserve === undefined && nbPlace === undefined) {
                return "No changes";
            }
            if (nom) {
                evenementFound.nom = nom;
            }
            if (date) {
                evenementFound.date = date;
            }
            if (description) {
                evenementFound.description = description;
            }
            if (lieu) {
                evenementFound.lieu = lieu;
            }
            if (estReserve !== undefined) {
                evenementFound.estReserve = estReserve;
            }
            if (nbPlace !== undefined) {
                evenementFound.nbPlace = nbPlace;
            }
            const evenementUpdate = yield repo.save(evenementFound);
            return evenementUpdate;
        });
    }
}
exports.EvenementUsecase = EvenementUsecase;
