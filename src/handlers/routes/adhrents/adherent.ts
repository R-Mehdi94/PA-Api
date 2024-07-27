import express, { Request, Response } from 'express';
import { AppDataSource } from '../../../database/database';
import { Adherent } from '../../../database/entities/adherent';
import { AdherentUsecase } from '../../../domain/adherent-usecase';
import { listAdherentValidation, createAdherentValidation, adherentIdValidation, updateAdherentValidation, verifAdherent } from '../../validators/adherent-validator';
import { generateValidationErrorMessage } from '../../validators/generate-validation-message';
import { authMiddlewareAdherent } from '../../middleware/auth-middleware';


export const AdherentHandler = (app: express.Express) => {
    app.get("/adherents", async (req: Request, res: Response) => {
        const validation = listAdherentValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listAdherentRequest = validation.value;
        let limit = 20;
        if (listAdherentRequest.limit) {
            limit = listAdherentRequest.limit;
        }
        const page = listAdherentRequest.page ?? 1;

        try {
            const adherentUsecase = new AdherentUsecase(AppDataSource);
            const listAdherents = await adherentUsecase.listAdherents({ ...listAdherentRequest, page, limit });
            res.status(200).send(listAdherents);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/adherents", async (req: Request, res: Response) => {
        const validation = createAdherentValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const adherentRequest = validation.value;

        const adherentRepo = AppDataSource.getRepository(Adherent);
        const adherentUsecase = new AdherentUsecase(AppDataSource);

        const emailExists = await adherentUsecase.verifEmailAdherent(adherentRequest.email);

        if (emailExists[0].verif > 0) {
            res.status(209).send({ "error": `Adherent ${adherentRequest.email} already exists` });
            return;
        }
        try {
            const adherentCreated = await adherentRepo.save(adherentRequest);
            res.status(201).send(adherentCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/adherents/:id",authMiddlewareAdherent, async (req: Request, res: Response) => {
        try {
            const validationResult = adherentIdValidation.validate({ ...req.params, ...req.body });

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const adherentUsecase = new AdherentUsecase(AppDataSource);

            if(await adherentUsecase.verifAdherentToken(+req.params.id, req.body.token) === false){
                res.status(400).send({ "error": `Bad Adherent` });
                return;
            } 

            const adherentId = validationResult.value;

            const adherentRepository = AppDataSource.getRepository(Adherent);
            const adherent = await adherentRepository.findOneBy({ id: adherentId.id });
            if (adherent === null) {
                res.status(404).send({ "error": `Adherent ${adherentId.id} not found` });
                return;
            }

            await adherentRepository.remove(adherent);
            res.status(200).send("Adherent supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/adherents/:id", authMiddlewareAdherent, async (req: Request, res: Response) => {
        try {
            const validationResult = adherentIdValidation.validate({ ...req.params, ...req.body });

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const adherentUsecase = new AdherentUsecase(AppDataSource);

            if(await adherentUsecase.verifAdherentToken(+req.params.id, req.body.token) === false){
                res.status(400).send({ "error": `Bad Adherent` });
                return;
            } 
            const adherentId = validationResult.value;

            const adherent = await adherentUsecase.getOneAdherent(adherentId.id);
            if (adherent === null) {
                res.status(404).send({ "error": `Adherent ${adherentId.id} not found` });
                return;
            }
            res.status(200).send(adherent);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/adherents/:id",authMiddlewareAdherent, async (req: Request, res: Response) => {
        const validation = updateAdherentValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const adherentUsecase = new AdherentUsecase(AppDataSource);

        if(await adherentUsecase.verifAdherentToken(+req.params.id, req.body.token) === false){
            res.status(400).send({ "error": `Bad Adherent` });
            return;
        } 

        const updateAdherentRequest = validation.value;

        try {
            const adherentUsecase = new AdherentUsecase(AppDataSource);

            const validationResult = adherentIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedAdherent = await adherentUsecase.updateAdherent(
                updateAdherentRequest.id,
                { ...updateAdherentRequest }
            );

            if (updatedAdherent === null) {
                res.status(404).send({ "error": `Adherent ${updateAdherentRequest.id} not found` });
                return;
            }

            if (updatedAdherent === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedAdherent);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/verifVisiteur", async (req: Request, res: Response) => {

        console.log(req.body)
        const validation = verifAdherent.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        try {
            const adherentUsecase = new AdherentUsecase(AppDataSource);
            const verifAdherent = await adherentUsecase.verifAdherent(validation.value.email, validation.value.numTel)

            if(verifAdherent[0]['count(*)'] > 0){
                res.status(200).send({ response: "Adherent existant" });
                return;
            }
            res.status(201).send({ response: "Adherent non existant" });

        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/visiteursEmail", async (req: Request, res: Response) => {

        try {
            const adherentUsecase = new AdherentUsecase(AppDataSource);
            const listAdherentEmail = await adherentUsecase.getAdherentEmail()

            res.status(200).send(listAdherentEmail);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
