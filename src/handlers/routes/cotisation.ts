import express, { Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Cotisation } from '../../database/entities/cotisation';
import { CotisationUsecase } from '../../domain/cotisation-usecase';
import { listCotisationValidation, createCotisationValidation, cotisationIdValidation, updateCotisationValidation } from '../validators/cotisation-validator';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';

export const CotisationHandler = (app: express.Express) => {
    app.get("/cotisations", async (req: Request, res: Response) => {
        const validation = listCotisationValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listCotisationRequest = validation.value;
        let limit = 20;
        if (listCotisationRequest.limit) {
            limit = listCotisationRequest.limit;
        }
        const page = listCotisationRequest.page ?? 1;

        try {
            const cotisationUsecase = new CotisationUsecase(AppDataSource);
            const listCotisations = await cotisationUsecase.listCotisations({ ...listCotisationRequest, page, limit });
            res.status(200).send(listCotisations);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/cotisations", async (req: Request, res: Response) => {
        const validation = createCotisationValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const cotisationRequest = validation.value;

        const cotisationRepo = AppDataSource.getRepository(Cotisation);

        try {
            const cotisationCreated = await cotisationRepo.save(cotisationRequest);
            res.status(201).send(cotisationCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/cotisations/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = cotisationIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const cotisationId = validationResult.value;

            const cotisationRepository = AppDataSource.getRepository(Cotisation);
            const cotisation = await cotisationRepository.findOneBy({ id: cotisationId.id });
            if (cotisation === null) {
                res.status(404).send({ "error": `Cotisation ${cotisationId.id} not found` });
                return;
            }

            await cotisationRepository.remove(cotisation);
            res.status(200).send("Cotisation supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/cotisations/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = cotisationIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const cotisationId = validationResult.value;

            const cotisationUsecase = new CotisationUsecase(AppDataSource);
            const cotisation = await cotisationUsecase.getOneCotisation(cotisationId.id);
            if (cotisation === null) {
                res.status(404).send({ "error": `Cotisation ${cotisationId.id} not found` });
                return;
            }
            res.status(200).send(cotisation);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/cotisations/:id", async (req: Request, res: Response) => {
        const validation = updateCotisationValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateCotisationRequest = validation.value;

        try {
            const cotisationUsecase = new CotisationUsecase(AppDataSource);

            const validationResult = cotisationIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedCotisation = await cotisationUsecase.updateCotisation(
                updateCotisationRequest.id,
                { ...updateCotisationRequest }
            );

            if (updatedCotisation === null) {
                res.status(404).send({ "error": `Cotisation ${updateCotisationRequest.id} not found` });
                return;
            }

            if (updatedCotisation === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedCotisation);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
