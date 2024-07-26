import express, { Request, Response } from "express";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";
import { AppDataSource } from "../../database/database";
import { createRessourceValidation, listRessourceValidation, ressourceIdValidation, updateRessourceValidation } from "../validators/ressource-validator";
import { RessourceUsecase } from "../../domain/ressource-usecase";
import { Ressource } from "../../database/entities/ressource";
import { createReservationValidation, listReservationValidation, reservationIdValidation, updateReservationValidation } from "../validators/reservation-validation";
import { ReservationUsecase } from "../../domain/reservation-usecase";
import { Reservation } from "../../database/entities/reservation";
import { User } from "../../database/entities/user";


export const ReservationHandler = (app: express.Express) => {
    
        app.get("/reservations", async (req: Request, res: Response) => {
            const validation = listReservationValidation.validate(req.query)

            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details))
                return
            }

            const listReservationRequest = validation.value
            let limit = 20
            if (listReservationRequest.limit) {
                limit = listReservationRequest.limit
            }
            const page = listReservationRequest.page ?? 1

            try {
                const reservationUsecase = new ReservationUsecase(AppDataSource);
                const listReservations = await reservationUsecase.listShowtime({ ...listReservationRequest, page, limit })
                res.status(200).send(listReservations)
            } catch (error) {
                console.log(error)
            }
        })





    app.post("/reservations", async (req: Request, res: Response) => {
        const validation = createReservationValidation.validate(req.body)
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
        const reservationRequest = validation.value

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: req.body.user})
        if(user?.role !== "Administrateur" && user?.role !== "Utilisateur"){
            res.status(400).send({ error: "Administrateur ou Adherent requis" })
            return
        }

        const reservationRepo = AppDataSource.getRepository(Reservation)

        try {
    
            const reservationCreated = await reservationRepo.save(
                reservationRequest
            )
            res.status(201).send(reservationCreated)
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" })
        }
    })
    

    
    app.delete("/reservations/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = reservationIdValidation.validate(req.params)
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const reservationId = validationResult.value
    
            const ReservationRepository = AppDataSource.getRepository(Reservation)
            const reservation = await ReservationRepository.findOneBy({ id: reservationId.id })
            if (reservation === null) {
                res.status(404).send({ "error": `reservation ${reservationId.id} not found` })
                return
            }
    
            await ReservationRepository.remove(reservation)
            res.status(200).send("Reservation supprimé avec succès")
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    
    app.get("/reservations/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = reservationIdValidation.validate(req.params)
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const reservationId = validationResult.value
    
            const reservationUsecase = new ReservationUsecase(AppDataSource);
            const reservation = await reservationUsecase.getOneReservation(reservationId.id)
            if (reservation === null) {
                res.status(404).send({ "error": `reservation ${reservationId.id} not found` })
                return
            }
            res.status(200).send(reservation)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    
    
    
    app.patch("/reservations/:id", async (req: Request, res: Response) => {
    
        const validation = updateReservationValidation.validate({ ...req.params, ...req.body })
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
    
        const UpdateReservationRequest = validation.value

        if(UpdateReservationRequest.user){
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: req.body.user})
            if(user?.role !== "Administrateur" && user?.role !== "Utilisateur"){
                res.status(400).send({ error: "Administrateur ou Adherent requis" })
                return
            }
        }
    
        try {
            const reservationUsecase = new ReservationUsecase(AppDataSource);
    
            const validationResult = reservationIdValidation.validate(req.params)
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
    
    
            const updatedReservation = await reservationUsecase.updateRessource(
                UpdateReservationRequest.id,
                { ...UpdateReservationRequest }
                )
    
            if (updatedReservation === null) {
                res.status(404).send({ "error": `ressource ${UpdateReservationRequest.id} not found `})
                return
            }

            if(updatedReservation === "No update provided"){
                res.status(400).send({ "error": `No update provided`})
                return
            }
    
    
    
            res.status(200).send(updatedReservation)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    
}
