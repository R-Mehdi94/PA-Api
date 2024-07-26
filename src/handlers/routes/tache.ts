import express, { Request, Response } from "express";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";
import { AppDataSource } from "../../database/database";
import { User } from "../../database/entities/user";
import { createTacheValidation, listTacheValidation, tacheIdValidation, updateTacheValidation } from "../validators/tache-validator";
import { TacheUsecase } from "../../domain/tache-usecase";
import { Tache } from "../../database/entities/tache";


export const TacheHandler = (app: express.Express) => {
    
        app.get("/taches", async (req: Request, res: Response) => {
            const validation = listTacheValidation.validate(req.query)

            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details))
                return
            }

            const listTacheRequest = validation.value
            let limit = 20
            if (listTacheRequest.limit) {
                limit = listTacheRequest.limit
            }
            const page = listTacheRequest.page ?? 1

            try {
                const tacheUsecase = new TacheUsecase(AppDataSource);
                const listTaches = await tacheUsecase.listTaches({ ...listTacheRequest, page, limit })
                res.status(200).send(listTaches)
            } catch (error) {
                console.log(error)
            }
        })

    app.post("/taches", async (req: Request, res: Response) => {
        const validation = createTacheValidation.validate(req.body)
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
        const tacheRequest = validation.value

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: req.body.responsable})
        if(user?.role !== "Administrateur" && user?.role !== "Utilisateur"){
            res.status(400).send({ error: "Administrateur ou Adherent requis" })
            return
        }

        const tacheRepo = AppDataSource.getRepository(Tache)

        try {
    
            const tacheCreated = await tacheRepo.save(
                tacheRequest
            )
            res.status(201).send(tacheCreated)
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" })
        }
    })
    

    
    app.delete("/taches/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = tacheIdValidation.validate(req.params)
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const tacheId = validationResult.value
    
            const tacheRepository = AppDataSource.getRepository(Tache)
            const tache = await tacheRepository.findOneBy({ id: tacheId.id })
            if (tache === null) {
                res.status(404).send({ "error": `tache ${tacheId.id} not found` })
                return
            }
    
            await tacheRepository.remove(tache)
            res.status(200).send("Tache supprimé avec succès")
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    
    app.get("/taches/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = tacheIdValidation.validate(req.params)
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const tacheId = validationResult.value
    
            const tacheUsecase = new TacheUsecase(AppDataSource);
            const tache = await tacheUsecase.getOneTache(tacheId.id)
            if (tache === null) {
                res.status(404).send({ "error": `tache ${tacheId.id} not found` })
                return
            }
            res.status(200).send(tache)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    
    
    
    app.patch("/taches/:id", async (req: Request, res: Response) => {
    
        const validation = updateTacheValidation.validate({ ...req.params, ...req.body })
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
    
        const UpdateTacheRequest = validation.value

        if(UpdateTacheRequest.responsable){
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: req.body.responsable})
            if(user?.role !== "Administrateur" && user?.role !== "Utilisateur"){
                res.status(400).send({ error: "Administrateur ou Adherent requis" })
                return
            }
        }
    
        try {
            const tacheUsecase = new TacheUsecase(AppDataSource);
    
            const validationResult = tacheIdValidation.validate(req.params)
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
    
    
            const updatedTache = await tacheUsecase.updateTache(
                UpdateTacheRequest.id,
                { ...UpdateTacheRequest }
                )
    
            if (updatedTache === null) {
                res.status(404).send({ "error": `tache ${UpdateTacheRequest.id} not found `})
                return
            }

            if(updatedTache === "No update provided"){
                res.status(400).send({ "error": `No update provided`})
                return
            }
    
    
    
            res.status(200).send(updatedTache)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    
}
