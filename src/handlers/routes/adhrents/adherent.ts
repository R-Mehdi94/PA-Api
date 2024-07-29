import express, { Request, Response } from 'express';
import { AppDataSource } from '../../../database/database';
import { Adherent } from '../../../database/entities/adherent';
import { AdherentUsecase } from '../../../domain/adherent-usecase';
import { listAdherentValidation, createAdherentValidation, adherentIdValidation, updateAdherentValidation, verifChangementMdp, updateAdherentValidationMdp } from '../../validators/adherent-validator';
import { generateValidationErrorMessage } from '../../validators/generate-validation-message';
import { authMiddlewareAdherent } from '../../middleware/auth-middleware';
import { User } from '../../../database/entities/user';
import { UserUsecase } from '../../../domain/user-usecase';
import { hash } from "bcrypt";


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


    app.post("/verifAdherentMdp", async (req: Request, res: Response) => {


        const validation = verifChangementMdp.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        
        try {
            const inscriptionUsecase = new AdherentUsecase(AppDataSource);
            const verifEmail = await inscriptionUsecase.verifInfoMdp(validation.value.email, validation.value.numTel);
            if(verifEmail[0]['count(*)'] > 0){
                res.status(200).send({ response: "Compte trouvé" });
                return;
            }
            res.status(201).send({ response: "Compte non trouvé" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/adherents/:id",async (req: Request, res: Response) => {
        try {
            const validationResult = updateAdherentValidation.validate({ ...req.params, ...req.body });
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
    
            const adherentUsecase = new AdherentUsecase(AppDataSource);
            const userUsecase = new UserUsecase(AppDataSource);
    
            if (validationResult.value.idAdmin !== undefined) {
                let user = await AppDataSource.getRepository(User).findOneBy({ id: validationResult.value.idAdmin });
    
                if (user?.role !== "Administrateur") {
                    if (await userUsecase.verifUser(+req.params.idAdmin, req.body.token) === false) {
                        res.status(400).send({ "error": `Bad user` });
                        return;
                    }
                }
            } else {
                if (await adherentUsecase.verifAdherentToken(+req.params.id, req.body.token) === false) {
                    res.status(400).send({ "error": `Bad user` });
                    return;
                }
            }
            // Handle password update separately
            if (validationResult.value.oldPassword !== undefined && validationResult.value.newPassword !== undefined) {
                if (await adherentUsecase.verifMdp(+req.params.id, validationResult.value.oldPassword) === false) {
                    res.status(400).send({ "error": `Bad mot de passe` });
                    return;
                }
                const newPasswordHash = await hash(validationResult.value.newPassword, 10);
                validationResult.value.motDePasse = newPasswordHash;
            }
    
            // Create update object without oldPassword and newPassword
            const updateAdherentRequest = { ...validationResult.value };
            delete updateAdherentRequest.oldPassword;
            delete updateAdherentRequest.newPassword;
    
            const updateAdherent = await adherentUsecase.updateAdherent(
                updateAdherentRequest.id,
                { ...updateAdherentRequest }
            );
    
            if (updateAdherent === null) {
                res.status(404).send({ "error": `Adherent ${updateAdherentRequest.id} not found` });
                return;
            }
    
            if (updateAdherent === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
    
            res.status(200).send(updateAdherent);
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

    app.patch("/adherentsMdp", async (req: Request, res: Response) => {
        const validation = updateAdherentValidationMdp.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateAdherentRequest = validation.value;

        try {

            const adherentUsecase = new AdherentUsecase(AppDataSource);
            const hashedPassword = await hash(updateAdherentRequest.motDePasse, 10);

            const updateAdherentmDP = await adherentUsecase.modifMdp(updateAdherentRequest.email, hashedPassword);

            res.status(200).send({response: updateAdherentmDP});
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

};


