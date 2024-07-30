import { DataSource } from "typeorm"
import { Dossier } from "../database/entities/dossier"
import { Token } from "../database/entities/token"
import { User } from "../database/entities/user"


export interface ListDossierRequest {
    page: number
    limit: number
    nom?: string
    nomUtilisateur?: string
    type?: string
    token?: number
    dossier?: number
    user?: number
}

export interface UpdateDossierParams {
    nom?: string
    nomUtilisateur?: string
    type?: string
    token?: Token
    dossier?: Dossier
    user?: User
}


export class DossierUsecase {

    constructor(private readonly db: DataSource) { }

    async getIdToken(nom: string): Promise<any | null> {

        const entityManager = this.db.getRepository(Token);

        const sqlQuery = `SELECT id FROM token WHERE blobName like ?;`;

        const idtToken = await entityManager.query(sqlQuery, [nom]);
        if (!idtToken.length) {
            return null;
        }
        return idtToken;
    }


    async getRacine(id: number): Promise<any | null> {

        const entityManager = this.db.getRepository(Token);

        const sqlQuery = `
                    
                    select nomUtilisateur as nomFichier, nom as VraiNom, tokenId as tokenId, 'fichier' AS Type, id from dossier where type like 'Fichier' AND (dossierId = 0 OR dossierId = NULL) AND userId = ?
                    UNION ALL

                    SELECT 
                        d.nomUtilisateur,
                        d.nom as VraiNom, 
                        d.id AS ID,
                        'dossier' AS Type 
                    FROM 
                        dossier d 

                    LEFT JOIN token t
                    ON d.tokenId = t.id
                    WHERE 
                        d.dossierId IS NULL AND d.userId = ? AND t.blobName is NULL;`;

                    /*const sqlQuery = `SELECT T.blobName as nomFichier, T.id, 'fichier' AS Type FROM token T LEFT JOIN dossier
                        D ON T.id = D.id WHERE D.tokenId IS NULL AND T.userId = ? and T.blobName is not NULL

                    UNION ALL

                    SELECT 
                        d.nom, 
                        d.id AS ID,
                        'dossier' AS Type 
                    FROM 
                        dossier d 
                    WHERE 
                        d.dossierId IS NULL AND d.userId = ?;`;  */
        const racine = await entityManager.query(sqlQuery, [id,id]);
        if (!racine.length) {
            return null;
        }
        return racine;
    }

    async  getArboDossier(id: number, dossierId:number): Promise<any | null> {

        const entityManager = this.db.getRepository(Token);

                            const sqlQuery = `WITH Combined AS (
                                    SELECT 
                                        dossier.nomUtilisateur AS Nom,
                                        dossier.nom as VraiNom, 
                                        token.id as tokenId,
                                        'fichier' AS Type,
                                        id 
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
                                        d1.nomUtilisateur AS Nom, 
                                        d1.nom as VraiNom, 
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

        const arboDossier = await entityManager.query(sqlQuery, [dossierId,id,dossierId,id]);
        if (!arboDossier.length) {
            return null;
        }

        return arboDossier;
    }

    async  getDossierParent(id: number, dossierId:number): Promise<any | null> {

        const entityManager = this.db.getRepository(Token);

        const sqlQuery = `SELECT      d2.nomUtilisateur AS nom, d2.nom as VraiNom,     d2.id AS id,      'dossier' AS Type  FROM      dossier d1 INNER JOIN      dossier d2  ON      d1.dossierId = d2.id  WHERE      d1.id = ? and d1.userId = ? UNION ALL SELECT 'Racine' AS nom, NULL AS id, 'racine' AS Type WHERE EXISTS (SELECT 1 FROM dossier d1 WHERE d1.id = ? AND d1.dossierId IS NULL AND d1.userId = ?);`;

        const dossierParent = await entityManager.query(sqlQuery, [dossierId,id,dossierId,id]);
        if (!dossierParent.length) {
            return null;
        }
        return dossierParent;
    }

    async listDossiers(listDossierRequest: ListDossierRequest): Promise<{ Dossiers: Dossier[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Dossier, 'dossier');
        if (listDossierRequest.nom) {
            query.andWhere("dossier.nom = :nom", { nom: listDossierRequest.nom });
        }

        if (listDossierRequest.nomUtilisateur) {
            query.andWhere("dossier.nomUtilisateur = :nomUtilisateur", { nomUtilisateur: listDossierRequest.nomUtilisateur });
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

        const [Dossiers, totalCount] = await query.getManyAndCount();
        return {
            Dossiers,
            totalCount
        };
    }

    async getOneDossier(id: number): Promise<Dossier | null> {
        const query = this.db.createQueryBuilder(Dossier, 'dossier')
            .leftJoinAndSelect('dossier.token', 'token')
            .leftJoinAndSelect('dossier.dossier', 'dossier')
            .leftJoinAndSelect('dossier.enfants', 'enfants')
            .leftJoinAndSelect('dossier.user', 'user')
            .where("dossier.id = :id", { id: id });

        const dossier = await query.getOne();

        if (!dossier) {
            console.log({ error: `Dossier ${id} not found` });
            return null;
        }
        return dossier;
    }

    async updateDossier(id: number, { nom, nomUtilisateur, type, token, dossier, user }: UpdateDossierParams): Promise<Dossier | string | null> {
        const repo = this.db.getRepository(Dossier);
        const dossierFound = await repo.findOneBy({ id });
        if (dossierFound === null) return null;

        if (nom === undefined && nomUtilisateur === undefined && type === undefined && token === undefined && dossier === undefined && user === undefined) {
            return "No changes";
        }

        if (nom) {
            dossierFound.nom = nom;
        }
        if (nomUtilisateur) {
            dossierFound.nomUtilisateur = nomUtilisateur;
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

        const dossierUpdate = await repo.save(dossierFound);
        return dossierUpdate;
    }
    
}