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
exports.TacheUsecase = void 0;
const tache_1 = require("../database/entities/tache");
class TacheUsecase {
    constructor(db) {
        this.db = db;
    }
    listTaches(listTacheRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(tache_1.Tache, 'tache');
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
            const [Taches, totalCount] = yield query.getManyAndCount();
            return {
                Taches,
                totalCount
            };
        });
    }
    getOneTache(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(tache_1.Tache, 'tache')
                .leftJoinAndSelect('tache.responsable', 'responsable')
                .leftJoinAndSelect('tache.ressource', 'ressource')
                .where("tache.id = :id", { id: id });
            const tache = yield query.getOne();
            if (!tache) {
                console.log({ error: `Tache ${id} not found` });
                return null;
            }
            return tache;
        });
    }
    updateTache(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { description, dateDebut, dateFin, statut, responsable, ressource }) {
            const repo = this.db.getRepository(tache_1.Tache);
            const tacheFound = yield repo.findOneBy({ id });
            if (tacheFound === null)
                return null;
            if (description === undefined && dateDebut === undefined && dateFin === undefined && statut === undefined && responsable === undefined && ressource === undefined) {
                return "No changes";
            }
            if (description) {
                tacheFound.description = description;
            }
            if (dateDebut) {
                tacheFound.dateDebut = dateDebut;
            }
            if (dateFin) {
                tacheFound.dateFin = dateFin;
            }
            if (statut) {
                tacheFound.statut = statut;
            }
            if (responsable) {
                tacheFound.responsable = responsable;
            }
            if (ressource) {
                tacheFound.ressource = ressource;
            }
            const tacheUpdate = yield repo.save(tacheFound);
            return tacheUpdate;
        });
    }
}
exports.TacheUsecase = TacheUsecase;
