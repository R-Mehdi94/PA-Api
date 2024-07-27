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
exports.AdherentUsecase = void 0;
const adherent_1 = require("../database/entities/adherent");
const token_1 = require("../database/entities/token");
const bcrypt_1 = require("bcrypt");
class AdherentUsecase {
    constructor(db) {
        this.db = db;
    }
    verifMdp(id, mdp) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(adherent_1.Adherent);
            // Récupérer le mot de passe haché de l'utilisateur avec l'ID spécifié
            const sqlQuery = `SELECT motDePasse FROM adherent WHERE id = ?;`;
            const result = yield entityManager.query(sqlQuery, [id]);
            if (result.length === 0) {
                console.log("Utilisateur non trouvé");
                return false;
            }
            const hashedPassword = result[0].motDePasse;
            const isPasswordValid = yield (0, bcrypt_1.compare)(mdp, hashedPassword);
            if (!isPasswordValid) {
                console.log("Mot de passe incorrect");
                return false;
            }
            return true;
        });
    }
    deleteToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const TokenDelete = yield this.db.createQueryBuilder().delete().from(token_1.Token).where("adherentId = :id", { id: id }).andWhere("blobName IS NULL").execute();
            return TokenDelete;
        });
    }
    verifAdherentToken(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const adherent = yield this.getOneAdherent(id);
            if (!adherent) {
                return false;
            }
            for (const element of adherent.tokens) {
                if (element.token === token) {
                    return true;
                }
            }
            return false;
        });
    }
    verifAdherent(email, numTel) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(adherent_1.Adherent);
            const sqlQuery = `select count(*) from adherent where email like ? and numTel = ?;`;
            const verifVisiteur = yield entityManager.query(sqlQuery, [email, numTel]);
            return verifVisiteur;
        });
    }
    getAdherentEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(adherent_1.Adherent);
            const sqlQuery = `SELECT GROUP_CONCAT(email SEPARATOR ', ') AS emails FROM adherent;`;
            const visiteurEmails = yield entityManager.query(sqlQuery);
            return visiteurEmails;
        });
    }
    verifEmailAdherent(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(adherent_1.Adherent);
            const sqlQuery = `select count(*) as verif from adherent where email=?;`;
            const verifEmail = yield entityManager.query(sqlQuery, [email]);
            return verifEmail;
        });
    }
    listAdherents(listAdherentRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(adherent_1.Adherent, 'adherent');
            if (listAdherentRequest.email) {
                query.andWhere("adherent.email = :email", { email: listAdherentRequest.email });
            }
            if (listAdherentRequest.nom) {
                query.andWhere("adherent.nom = :nom", { nom: listAdherentRequest.nom });
            }
            if (listAdherentRequest.prenom) {
                query.andWhere("adherent.prenom = :prenom", { prenom: listAdherentRequest.prenom });
            }
            if (listAdherentRequest.age) {
                query.andWhere("adherent.age = :age", { age: listAdherentRequest.age });
            }
            if (listAdherentRequest.numTel) {
                query.andWhere("adherent.numTel = :numTel", { numTel: listAdherentRequest.numTel });
            }
            if (listAdherentRequest.adresse) {
                query.andWhere("adherent.adresse = :adresse", { adresse: listAdherentRequest.adresse });
            }
            if (listAdherentRequest.profession) {
                query.andWhere("adherent.profession = :profession", { profession: listAdherentRequest.profession });
            }
            if (listAdherentRequest.estBanie !== undefined) {
                query.andWhere("adherent.estBanie = :estBanie", { estBanie: listAdherentRequest.estBanie });
            }
            if (listAdherentRequest.estBenevole !== undefined) {
                query.andWhere("adherent.estBenevole = :estBenevole", { estBenevole: listAdherentRequest.estBenevole });
            }
            if (listAdherentRequest.parrain) {
                query.andWhere("adherent.parrainId = :parrain", { parrain: listAdherentRequest.parrain });
            }
            query.leftJoinAndSelect('adherent.parrain', 'parrain')
                .leftJoinAndSelect('adherent.inscriptions', 'inscriptions')
                .leftJoinAndSelect('adherent.cotisations', 'cotisations')
                .leftJoinAndSelect('adherent.tokens', 'tokens')
                .leftJoinAndSelect('adherent.demandes', 'demandes')
                .skip((listAdherentRequest.page - 1) * listAdherentRequest.limit)
                .take(listAdherentRequest.limit);
            const [Adherents, totalCount] = yield query.getManyAndCount();
            return {
                Adherents,
                totalCount
            };
        });
    }
    getOneAdherent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(adherent_1.Adherent, 'adherent')
                .leftJoinAndSelect('adherent.parrain', 'parrain')
                .leftJoinAndSelect('adherent.inscriptions', 'inscriptions')
                .leftJoinAndSelect('adherent.cotisations', 'cotisations')
                .leftJoinAndSelect('adherent.tokens', 'tokens')
                .leftJoinAndSelect('adherent.demandes', 'demandes')
                .where("adherent.id = :id", { id: id });
            const adherent = yield query.getOne();
            if (!adherent) {
                console.log({ error: `Adherent ${id} not found` });
                return null;
            }
            return adherent;
        });
    }
    updateAdherent(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { email, motDePasse, nom, prenom, age, numTel, adresse, profession, estBanie, estBenevole, parrain }) {
            const repo = this.db.getRepository(adherent_1.Adherent);
            const adherentFound = yield repo.findOneBy({ id });
            if (adherentFound === null)
                return null;
            if (email === undefined && motDePasse === undefined && nom === undefined && prenom === undefined && age === undefined && numTel === undefined && adresse === undefined && profession === undefined && estBanie === undefined && estBenevole === undefined && parrain === undefined) {
                return "No changes";
            }
            if (email) {
                adherentFound.email = email;
            }
            if (motDePasse) {
                adherentFound.motDePasse = motDePasse;
            }
            if (nom) {
                adherentFound.nom = nom;
            }
            if (prenom) {
                adherentFound.prenom = prenom;
            }
            if (age !== undefined) {
                adherentFound.age = age;
            }
            if (numTel) {
                adherentFound.numTel = numTel;
            }
            if (adresse) {
                adherentFound.adresse = adresse;
            }
            if (profession) {
                adherentFound.profession = profession;
            }
            if (estBanie !== undefined) {
                adherentFound.estBanie = estBanie;
            }
            if (estBenevole !== undefined) {
                adherentFound.estBenevole = estBenevole;
            }
            if (parrain) {
                adherentFound.parrain = parrain;
            }
            const adherentUpdate = yield repo.save(adherentFound);
            return adherentUpdate;
        });
    }
}
exports.AdherentUsecase = AdherentUsecase;
