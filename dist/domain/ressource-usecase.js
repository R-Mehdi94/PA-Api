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
exports.RessourceUsecase = void 0;
const ressource_1 = require("../database/entities/ressource");
class RessourceUsecase {
    constructor(db) {
        this.db = db;
    }
    listRessources(listRessourceRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(ressource_1.Ressource, 'ressource');
            if (listRessourceRequest.nom) {
                query.andWhere("ressource.nom = :nom", { nom: listRessourceRequest.nom });
            }
            if (listRessourceRequest.type) {
                query.andWhere("ressource.type = :type", { type: listRessourceRequest.type });
            }
            if (listRessourceRequest.quantite) {
                query.andWhere("ressource.quantite = :quantite", { quantite: listRessourceRequest.quantite });
            }
            if (listRessourceRequest.emplacement) {
                query.andWhere("ressource.emplacement = :emplacement", { emplacement: listRessourceRequest.emplacement });
            }
            query.leftJoinAndSelect('ressource.evenementRessources', 'evenementRessources')
                .leftJoinAndSelect('ressource.evenementUsers', 'evenementUsers')
                .leftJoinAndSelect('ressource.taches', 'taches')
                .skip((listRessourceRequest.page - 1) * listRessourceRequest.limit)
                .take(listRessourceRequest.limit);
            const [Ressources, totalCount] = yield query.getManyAndCount();
            return {
                Ressources,
                totalCount
            };
        });
    }
    getOneRessource(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(ressource_1.Ressource, 'ressource')
                .leftJoinAndSelect('ressource.evenementRessources', 'evenementRessources')
                .leftJoinAndSelect('ressource.evenementUsers', 'evenementUsers')
                .leftJoinAndSelect('ressource.taches', 'taches')
                .where("ressource.id = :id", { id: id });
            const ressource = yield query.getOne();
            if (!ressource) {
                console.log({ error: `Ressource ${id} not found` });
                return null;
            }
            return ressource;
        });
    }
    updateRessource(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nom, type, quantite, emplacement }) {
            const repo = this.db.getRepository(ressource_1.Ressource);
            const ressourceFound = yield repo.findOneBy({ id });
            if (ressourceFound === null)
                return null;
            if (nom === undefined && type === undefined && quantite === undefined && emplacement === undefined) {
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
            if (emplacement) {
                ressourceFound.emplacement = emplacement;
            }
            const ressourceUpdate = yield repo.save(ressourceFound);
            return ressourceUpdate;
        });
    }
}
exports.RessourceUsecase = RessourceUsecase;
