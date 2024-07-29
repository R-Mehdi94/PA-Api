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
exports.DossierUsecase = void 0;
const dossier_1 = require("../database/entities/dossier");
const token_1 = require("../database/entities/token");
class DossierUsecase {
    constructor(db) {
        this.db = db;
    }
    getIdToken(nom) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(token_1.Token);
            const sqlQuery = `SELECT id FROM token WHERE blobName like ?;`;
            const idtToken = yield entityManager.query(sqlQuery, [nom]);
            if (!idtToken.length) {
                return null;
            }
            return idtToken;
        });
    }
    getRacine(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(token_1.Token);
            const sqlQuery = `
                    
                    select nom as nomFichier, tokenId, 'fichier' AS Type from dossier where type like 'Fichier' AND (dossierId = 0 OR dossierId = NULL) AND userId = ?
                    UNION ALL

                    SELECT 
                        d.nom, 
                        d.id AS ID,
                        'dossier' AS Type 
                    FROM 
                        dossier d 

                    LEFT JOIN token t
                    ON d.tokenId = t.id
                    WHERE 
                        d.dossierId IS NULL AND d.userId = 1 AND t.blobName is NULL;`;
            const racine = yield entityManager.query(sqlQuery, [id, id]);
            if (!racine.length) {
                return null;
            }
            return racine;
        });
    }
    getArboDossier(id, dossierId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(token_1.Token);
            const sqlQuery = `WITH Combined AS (
                                    SELECT 
                                        token.blobName AS Nom, 
                                        token.id, 
                                        'fichier' AS Type 
                                    FROM 
                                        token 
                                    INNER JOIN 
                                        dossier 
                                    ON 
                                        token.id = dossier.tokenId 
                                    WHERE 
                                        dossier.dossierId = ? 
                                        AND token.userId = ?

                                    UNION ALL

                                    SELECT 
                                        d1.nom AS Nom, 
                                        d1.id AS id,
                                        'dossier' AS Type 
                                    FROM 
                                        dossier d1
                                    WHERE 
                                        d1.dossierId = ?
                                        AND d1.userId = ?
                                )
                                SELECT *
                                FROM Combined c1
                                WHERE Type = 'fichier'
                                OR (Type = 'dossier' AND NOT EXISTS (
                                    SELECT 1
                                    FROM Combined c2
                                    WHERE c2.Nom = c1.Nom 
                                        AND c2.Type = 'fichier'
                                ));
                                `;
            const arboDossier = yield entityManager.query(sqlQuery, [dossierId, id, dossierId, id]);
            if (!arboDossier.length) {
                return null;
            }
            return arboDossier;
        });
    }
    getDossierParent(id, dossierId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(token_1.Token);
            const sqlQuery = `SELECT      d2.nom AS nom,      d2.id AS id,      'dossier' AS Type  FROM      dossier d1 INNER JOIN      dossier d2  ON      d1.dossierId = d2.id  WHERE      d1.id = ? and d1.userId = ? UNION ALL SELECT 'Racine' AS nom, NULL AS id, 'racine' AS Type WHERE EXISTS (SELECT 1 FROM dossier d1 WHERE d1.id = ? AND d1.dossierId IS NULL AND d1.userId = ?);`;
            const dossierParent = yield entityManager.query(sqlQuery, [dossierId, id, dossierId, id]);
            if (!dossierParent.length) {
                return null;
            }
            return dossierParent;
        });
    }
    listDossiers(listDossierRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(dossier_1.Dossier, 'dossier');
            if (listDossierRequest.nom) {
                query.andWhere("dossier.nom = :nom", { nom: listDossierRequest.nom });
            }
            if (listDossierRequest.type) {
                query.andWhere("dossier.type = :type", { type: listDossierRequest.type });
            }
            if (listDossierRequest.token) {
                query.andWhere("dossier.tokenId = :token", { token: listDossierRequest.token });
            }
            if (listDossierRequest.dossier) {
                query.andWhere("dossier.dossierId = :dossier", { dossier: listDossierRequest.dossier });
            }
            if (listDossierRequest.user) {
                query.andWhere("dossier.userId = :user", { user: listDossierRequest.user });
            }
            query.leftJoinAndSelect('dossier.token', 'token')
                .leftJoinAndSelect('dossier.dossier', 'dossier')
                .leftJoinAndSelect('dossier.enfants', 'enfants')
                .leftJoinAndSelect('dossier.user', 'user')
                .skip((listDossierRequest.page - 1) * listDossierRequest.limit)
                .take(listDossierRequest.limit);
            const [Dossiers, totalCount] = yield query.getManyAndCount();
            return {
                Dossiers,
                totalCount
            };
        });
    }
    getOneDossier(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(dossier_1.Dossier, 'dossier')
                .leftJoinAndSelect('dossier.token', 'token')
                .leftJoinAndSelect('dossier.dossier', 'dossier')
                .leftJoinAndSelect('dossier.enfants', 'enfants')
                .leftJoinAndSelect('dossier.user', 'user')
                .where("dossier.id = :id", { id: id });
            const dossier = yield query.getOne();
            if (!dossier) {
                console.log({ error: `Dossier ${id} not found` });
                return null;
            }
            return dossier;
        });
    }
    updateDossier(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nom, type, token, dossier, user }) {
            const repo = this.db.getRepository(dossier_1.Dossier);
            const dossierFound = yield repo.findOneBy({ id });
            if (dossierFound === null)
                return null;
            if (nom === undefined && type === undefined && token === undefined && dossier === undefined && user === undefined) {
                return "No changes";
            }
            if (nom) {
                dossierFound.nom = nom;
            }
            if (type) {
                dossierFound.type = type;
            }
            if (token) {
                dossierFound.token = token;
            }
            if (dossier) {
                dossierFound.dossier = dossier;
            }
            if (user) {
                dossierFound.user = user;
            }
            const dossierUpdate = yield repo.save(dossierFound);
            return dossierUpdate;
        });
    }
}
exports.DossierUsecase = DossierUsecase;
