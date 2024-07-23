import express, { Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { Dossier } from "../../database/entities/dossier";
import { DossierUsecase } from "../../domain/dossier-usecase";
import { listDossierValidation, createDossierValidation, dossierIdValidation, updateDossierValidation, dossierUserIdValidation } from "../validators/dossier-validator";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";
import { authMiddlewareAll } from '../middleware/auth-middleware';
import { AzureBlobServiceUsecase } from '../../domain/azureBlobService-usecase';
import { UserUsecase } from '../../domain/user-usecase';
import { getIdToken, userIdValidation } from '../validators/user-validator';

export const DossierHandler = (app: express.Express) => {

    app.post("/idToken/:id", authMiddlewareAll, async (req: Request, res: Response) => {
        const validationResult = getIdToken.validate({ ...req.params, ...req.body });

        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }

        const userUsecase = new UserUsecase(AppDataSource);

        if(await userUsecase.verifUser(+req.params.id, req.body.token) === false){
            res.status(400).send({ "error": `Bad user` });
            return;
        } 

        const nom = validationResult.value.name;

        try {
            const dossierUsecase = new DossierUsecase(AppDataSource);
            const idToken = await dossierUsecase.getIdToken(nom);

            if (!idToken) {
                res.status(200).send({ "reponse": `Aucun fichier` });
                return
            }

            res.json({ idToken });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });

    app.post("/racine/:id", authMiddlewareAll, async (req: Request, res: Response) => {
        const validationResult = userIdValidation.validate({ ...req.params, ...req.body });

        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }

        const userUsecase = new UserUsecase(AppDataSource);

        if(await userUsecase.verifUser(+req.params.id, req.body.token) === false){
            res.status(400).send({ "error": `Bad user` });
            return;
        } 

        const userId = validationResult.value.id;

        try {
            const dossierUsecase = new DossierUsecase(AppDataSource);
            const racine = await dossierUsecase.getRacine(userId);

            if (!racine) {
                res.status(200).send({ "reponse": `Aucun fichier ou dossier` });
                return
            }

            res.json({ racine });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });

    app.post("/arboDossier/:id", authMiddlewareAll, async (req: Request, res: Response) => {
        const validationResult = dossierUserIdValidation.validate({ ...req.params, ...req.body });

        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }

        const userUsecase = new UserUsecase(AppDataSource);

        if(await userUsecase.verifUser(+req.params.id, req.body.token) === false){
            res.status(400).send({ "error": `Bad user` });
            return;
        } 

        const userId = validationResult.value.id;
        const dossierId = validationResult.value.dossierId;

        try {
            const dossierUsecase = new DossierUsecase(AppDataSource);
            const arboDossier = await dossierUsecase.getArboDossier(userId, dossierId);

            if (!arboDossier) {
                res.status(200).send({ "reponse": `Aucun fichier ou dossier` });
                return
            }

            res.json({ arboDossier });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });


    app.post("/dossierParent/:id", authMiddlewareAll, async (req: Request, res: Response) => {
        const validationResult = dossierUserIdValidation.validate({ ...req.params, ...req.body });

        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }

        const userUsecase = new UserUsecase(AppDataSource);

        if(await userUsecase.verifUser(+req.params.id, req.body.token) === false){
            res.status(400).send({ "error": `Bad user` });
            return;
        } 

        const userId = validationResult.value.id;
        const dossierId = validationResult.value.dossierId;

        try {
            const dossierUsecase = new DossierUsecase(AppDataSource);
            const dossierParent = await dossierUsecase.getDossierParent(userId, dossierId);

            if (!dossierParent) {
                res.status(200).send({ "reponse": `Aucun fichier ou dossier` });
                return
            }

            res.json({ dossierParent });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });


    app.get("/dossiers", async (req: Request, res: Response) => {
        const validation = listDossierValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listDossierRequest = validation.value;
        let limit = 20;
        if (listDossierRequest.limit) {
            limit = listDossierRequest.limit;
        }
        const page = listDossierRequest.page ?? 1;

        try {
            const dossierUsecase = new DossierUsecase(AppDataSource);
            const listDossiers = await dossierUsecase.listDossiers({ ...listDossierRequest, page, limit });
            res.status(200).send(listDossiers);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/dossiers", async (req: Request, res: Response) => {
        const validation = createDossierValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const dossierRequest = validation.value;

        const dossierRepo = AppDataSource.getRepository(Dossier);

        try {
            const dossierCreated = await dossierRepo.save(dossierRequest);
            res.status(201).send(dossierCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/dossiers/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = dossierIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const dossierId = validationResult.value;

            const dossierRepository = AppDataSource.getRepository(Dossier);
            const dossier = await dossierRepository.findOneBy({ id: dossierId.id });
            if (dossier === null) {
                res.status(404).send({ "error": `Dossier ${dossierId.id} not found` });
                return;
            }

            await dossierRepository.remove(dossier);
            res.status(200).send("Dossier supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/dossiers/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = dossierIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const dossierId = validationResult.value;

            const dossierUsecase = new DossierUsecase(AppDataSource);
            const dossier = await dossierUsecase.getOneDossier(dossierId.id);
            if (dossier === null) {
                res.status(404).send({ "error": `Dossier ${dossierId.id} not found` });
                return;
            }
            res.status(200).send(dossier);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/dossiers/:id", async (req: Request, res: Response) => {
        const validation = updateDossierValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateDossierRequest = validation.value;

        try {
            const dossierUsecase = new DossierUsecase(AppDataSource);

            const validationResult = dossierIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedDossier = await dossierUsecase.updateDossier(
                updateDossierRequest.id,
                { ...updateDossierRequest }
            );

            if (updatedDossier === null) {
                res.status(404).send({ "error": `Dossier ${updateDossierRequest.id} not found` });
                return;
            }

            if (updatedDossier === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedDossier);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
}