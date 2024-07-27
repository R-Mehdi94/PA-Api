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
exports.VisiteurUsecase = void 0;
const visiteur_1 = require("../database/entities/visiteur");
class VisiteurUsecase {
    constructor(db) {
        this.db = db;
    }
    listVisiteurs(listVisiteurRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(visiteur_1.Visiteur, 'visiteur');
            if (listVisiteurRequest.email) {
                query.andWhere("visiteur.email = :email", { email: listVisiteurRequest.email });
            }
            if (listVisiteurRequest.nom) {
                query.andWhere("visiteur.nom = :nom", { nom: listVisiteurRequest.nom });
            }
            if (listVisiteurRequest.prenom) {
                query.andWhere("visiteur.prenom = :prenom", { prenom: listVisiteurRequest.prenom });
            }
            if (listVisiteurRequest.age) {
                query.andWhere("visiteur.age = :age", { age: listVisiteurRequest.age });
            }
            if (listVisiteurRequest.numTel) {
                query.andWhere("visiteur.numTel = :numTel", { numTel: listVisiteurRequest.numTel });
            }
            if (listVisiteurRequest.profession) {
                query.andWhere("visiteur.profession = :profession", { profession: listVisiteurRequest.profession });
            }
            if (listVisiteurRequest.estBanie !== undefined) {
                query.andWhere("visiteur.estBanie = :estBanie", { estBanie: listVisiteurRequest.estBanie });
            }
            query.leftJoinAndSelect('visiteur.inscriptions', 'inscriptions')
                .leftJoinAndSelect('visiteur.transactions', 'transactions')
                .leftJoinAndSelect('visiteur.demandes', 'demandes')
                .leftJoinAndSelect('demandes.evenementDemandes', 'evenementDemandes')
                .leftJoinAndSelect('demandes.aideProjetDemandes', 'aideProjetDemandes')
                .leftJoinAndSelect('demandes.parrainageDemandes', 'parrainageDemandes')
                .leftJoinAndSelect('demandes.autreDemandes', 'autreDemandes')
                .skip((listVisiteurRequest.page - 1) * listVisiteurRequest.limit)
                .take(listVisiteurRequest.limit);
            const [Visiteurs, totalCount] = yield query.getManyAndCount();
            return {
                Visiteurs,
                totalCount
            };
        });
    }
    getOneVisiteur(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(visiteur_1.Visiteur, 'visiteur')
                .leftJoinAndSelect('visiteur.inscriptions', 'inscriptions')
                .leftJoinAndSelect('visiteur.transactions', 'transactions')
                .leftJoinAndSelect('demandes.evenementDemandes', 'evenementDemandes')
                .leftJoinAndSelect('demandes.aideProjetDemandes', 'aideProjetDemandes')
                .leftJoinAndSelect('demandes.parrainageDemandes', 'parrainageDemandes')
                .leftJoinAndSelect('demandes.autreDemandes', 'autreDemandes')
                .where("visiteur.id = :id", { id: id });
            const visiteur = yield query.getOne();
            if (!visiteur) {
                console.log({ error: `Visiteur ${id} not found` });
                return null;
            }
            return visiteur;
        });
    }
    updateVisiteur(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { email, nom, prenom, age, numTel, profession, estBanie }) {
            const repo = this.db.getRepository(visiteur_1.Visiteur);
            const visiteurFound = yield repo.findOneBy({ id });
            if (visiteurFound === null)
                return null;
            if (email === undefined && nom === undefined && prenom === undefined && age === undefined && numTel === undefined && profession === undefined && estBanie === undefined) {
                return "No changes";
            }
            if (email) {
                visiteurFound.email = email;
            }
            if (nom) {
                visiteurFound.nom = nom;
            }
            if (prenom) {
                visiteurFound.prenom = prenom;
            }
            if (age !== undefined) {
                visiteurFound.age = age;
            }
            if (numTel) {
                visiteurFound.numTel = numTel;
            }
            if (profession) {
                visiteurFound.profession = profession;
            }
            if (estBanie !== undefined) {
                visiteurFound.estBanie = estBanie;
            }
            const visiteurUpdate = yield repo.save(visiteurFound);
            return visiteurUpdate;
        });
    }
}
exports.VisiteurUsecase = VisiteurUsecase;
