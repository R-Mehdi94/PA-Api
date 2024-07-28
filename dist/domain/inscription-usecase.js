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
exports.InscriptionUsecase = void 0;
const inscription_1 = require("../database/entities/inscription");
class InscriptionUsecase {
    constructor(db) {
        this.db = db;
    }
    deleteInscriptionAdherent(idAdherent, idEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(inscription_1.Inscription);
            const sqlQuery = `delete from inscription where adherentId like ? and evenementId = ?;`;
            const deleteInscriptionAdherent = yield entityManager.query(sqlQuery, [idAdherent, idEvent]);
            return deleteInscriptionAdherent;
        });
    }
    deleteInscription(email, idEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(inscription_1.Inscription);
            const sqlQuery = `delete from inscription where emailVisiteur like ? and evenementId = ?;`;
            const deleteInscription = yield entityManager.query(sqlQuery, [email, idEvent]);
            return deleteInscription;
        });
    }
    verifEmailAdherent(adherentId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(inscription_1.Inscription);
            const sqlQuery = `select count(*) from inscription where adherentId=? and evenementId=?;`;
            const verifEmail = yield entityManager.query(sqlQuery, [adherentId, id]);
            return verifEmail;
        });
    }
    verifEmailVisiteur(visiteurId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(inscription_1.Inscription);
            const sqlQuery = `select count(*) from inscription where visiteurId=? and evenementId=?;`;
            const verifEmail = yield entityManager.query(sqlQuery, [visiteurId, id]);
            return verifEmail;
        });
    }
    nbPlace(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(inscription_1.Inscription);
            const sqlQuery = `select nbPlace from evenement where id=?;`;
            const nbPlace = yield entityManager.query(sqlQuery, [id]);
            return nbPlace;
        });
    }
    listInscriptions(listInscriptionRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(inscription_1.Inscription, 'inscription');
            if (listInscriptionRequest.evenement) {
                query.andWhere("inscription.evenementId = :evenement", { evenement: listInscriptionRequest.evenement });
            }
            if (listInscriptionRequest.visiteur) {
                query.andWhere("inscription.visiteurId = :visiteur", { visiteur: listInscriptionRequest.visiteur });
            }
            if (listInscriptionRequest.adherent) {
                query.andWhere("inscription.adherentId = :adherent", { adherent: listInscriptionRequest.adherent });
            }
            query.leftJoinAndSelect('inscription.evenement', 'evenement')
                .leftJoinAndSelect('inscription.visiteur', 'visiteur')
                .leftJoinAndSelect('inscription.adherent', 'adherent')
                .skip((listInscriptionRequest.page - 1) * listInscriptionRequest.limit)
                .take(listInscriptionRequest.limit);
            const [Inscriptions, totalCount] = yield query.getManyAndCount();
            return {
                Inscriptions,
                totalCount
            };
        });
    }
    getOneInscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(inscription_1.Inscription, 'inscription')
                .leftJoinAndSelect('inscription.evenement', 'evenement')
                .leftJoinAndSelect('inscription.visiteur', 'visiteur')
                .leftJoinAndSelect('inscription.adherent', 'adherent')
                .where("inscription.id = :id", { id: id });
            const inscription = yield query.getOne();
            if (!inscription) {
                console.log({ error: `Inscription ${id} not found` });
                return null;
            }
            return inscription;
        });
    }
    updateInscription(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { evenement, visiteur, adherent }) {
            const repo = this.db.getRepository(inscription_1.Inscription);
            const inscriptionFound = yield repo.findOneBy({ id });
            if (inscriptionFound === null)
                return null;
            if (evenement === undefined && visiteur === undefined && adherent === undefined) {
                return "No changes";
            }
            if (evenement) {
                inscriptionFound.evenement = evenement;
            }
            if (visiteur) {
                inscriptionFound.visiteur = visiteur;
            }
            if (adherent) {
                inscriptionFound.adherent = adherent;
            }
            const inscriptionUpdate = yield repo.save(inscriptionFound);
            return inscriptionUpdate;
        });
    }
}
exports.InscriptionUsecase = InscriptionUsecase;
